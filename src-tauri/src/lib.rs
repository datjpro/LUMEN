use std::sync::{
    atomic::{AtomicBool, Ordering},
    Arc, Mutex,
};
use tauri::{
    menu::{Menu, MenuItem},
    tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent},
    Emitter, Manager, Runtime,
};
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Copy, Serialize, Deserialize)]
pub struct HitRect {
    pub x: f64,
    pub y: f64,
    pub width: f64,
    pub height: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SystemMetricsPayload {
    pub is_native: bool,
    pub cpu_usage: f32,
    pub ram_usage: f32,
    pub ram_used_mb: u64,
    pub ram_total_mb: u64,
    pub battery_level: Option<u8>,
    pub battery_charging: Option<bool>,
    pub cpu_cores: usize,
}

#[cfg(windows)]
static LAST_CPU_TIMES: Mutex<Option<(u64, u64, u64)>> = Mutex::new(None);

#[tauri::command]
fn get_system_metrics() -> Result<SystemMetricsPayload, String> {
    #[cfg(windows)]
    {
        use windows_sys::Win32::System::SystemInformation::{GlobalMemoryStatusEx, MEMORYSTATUSEX, GetSystemInfo, SYSTEM_INFO};
        use windows_sys::Win32::System::Threading::GetSystemTimes;
        use windows_sys::Win32::System::Power::{GetSystemPowerStatus, SYSTEM_POWER_STATUS};
        use windows_sys::Win32::Foundation::FILETIME;

        // 1. Physical RAM
        let mut mem: MEMORYSTATUSEX = unsafe { std::mem::zeroed() };
        mem.dwLength = std::mem::size_of::<MEMORYSTATUSEX>() as u32;
        let (ram_usage, ram_used_mb, ram_total_mb) = unsafe {
            if GlobalMemoryStatusEx(&mut mem) != 0 {
                let total_mb = mem.ullTotalPhys / (1024 * 1024);
                let avail_mb = mem.ullAvailPhys / (1024 * 1024);
                let used_mb = total_mb.saturating_sub(avail_mb);
                (mem.dwMemoryLoad as f32, used_mb, total_mb)
            } else {
                (0.0, 0, 0)
            }
        };

        // 2. CPU Usage via GetSystemTimes delta
        let mut idle_time: FILETIME = unsafe { std::mem::zeroed() };
        let mut kernel_time: FILETIME = unsafe { std::mem::zeroed() };
        let mut user_time: FILETIME = unsafe { std::mem::zeroed() };

        let cpu_usage = unsafe {
            if GetSystemTimes(&mut idle_time, &mut kernel_time, &mut user_time) != 0 {
                let idle = ((idle_time.dwHighDateTime as u64) << 32) | (idle_time.dwLowDateTime as u64);
                let kernel = ((kernel_time.dwHighDateTime as u64) << 32) | (kernel_time.dwLowDateTime as u64);
                let user = ((user_time.dwHighDateTime as u64) << 32) | (user_time.dwLowDateTime as u64);

                let mut last = LAST_CPU_TIMES.lock().unwrap_or_else(|e| e.into_inner());
                let usage = if let Some((last_idle, last_kernel, last_user)) = *last {
                    let d_idle = idle.saturating_sub(last_idle);
                    let d_kernel = kernel.saturating_sub(last_kernel);
                    let d_user = user.saturating_sub(last_user);
                    let total_sys = d_kernel + d_user;
                    if total_sys > 0 {
                        let active = total_sys.saturating_sub(d_idle);
                        ((active as f64 / total_sys as f64) * 100.0) as f32
                    } else {
                        0.0
                    }
                } else {
                    4.0
                };
                *last = Some((idle, kernel, user));
                usage.clamp(0.0, 100.0)
            } else {
                0.0
            }
        };

        // 3. CPU Cores
        let mut sys_info: SYSTEM_INFO = unsafe { std::mem::zeroed() };
        let cpu_cores = unsafe {
            GetSystemInfo(&mut sys_info);
            sys_info.dwNumberOfProcessors as usize
        };

        // 4. Battery / Power
        let mut power: SYSTEM_POWER_STATUS = unsafe { std::mem::zeroed() };
        let (battery_level, battery_charging) = unsafe {
            if GetSystemPowerStatus(&mut power) != 0 {
                let level = if power.BatteryLifePercent <= 100 {
                    Some(power.BatteryLifePercent)
                } else {
                    None
                };
                let charging = if power.ACLineStatus == 1 {
                    Some(true)
                } else if power.ACLineStatus == 0 {
                    Some(false)
                } else {
                    None
                };
                (level, charging)
            } else {
                (None, None)
            }
        };

        Ok(SystemMetricsPayload {
            is_native: true,
            cpu_usage: (cpu_usage * 10.0).round() / 10.0,
            ram_usage: (ram_usage * 10.0).round() / 10.0,
            ram_used_mb,
            ram_total_mb,
            battery_level,
            battery_charging,
            cpu_cores: if cpu_cores > 0 { cpu_cores } else { 4 },
        })
    }
    #[cfg(not(windows))]
    {
        Ok(SystemMetricsPayload {
            is_native: false,
            cpu_usage: 10.0,
            ram_usage: 30.0,
            ram_used_mb: 2048,
            ram_total_mb: 8192,
            battery_level: None,
            battery_charging: None,
            cpu_cores: 4,
        })
    }
}

pub struct AppState {
    pub interactive_rects: Mutex<Vec<HitRect>>,
    pub is_ignoring: AtomicBool,
    pub force_interactive: AtomicBool,
    pub has_received_rects: AtomicBool,
}

impl Default for AppState {
    fn default() -> Self {
        Self {
            interactive_rects: Mutex::new(Vec::new()),
            is_ignoring: AtomicBool::new(false),
            force_interactive: AtomicBool::new(false),
            has_received_rects: AtomicBool::new(false),
        }
    }
}

#[tauri::command]
fn update_interactive_rects(
    state: tauri::State<Arc<AppState>>,
    window: tauri::WebviewWindow,
    rects: Vec<HitRect>,
    force_interactive: bool,
) -> Result<(), String> {
    state.has_received_rects.store(true, Ordering::SeqCst);
    if let Ok(mut r) = state.interactive_rects.lock() {
        *r = rects;
    }
    state.force_interactive.store(force_interactive, Ordering::SeqCst);
    if force_interactive {
        let _ = window.set_ignore_cursor_events(false);
        state.is_ignoring.store(false, Ordering::SeqCst);
    }
    Ok(())
}

#[tauri::command]
fn set_ignore_cursor_events<R: Runtime>(
    state: tauri::State<Arc<AppState>>,
    window: tauri::WebviewWindow<R>,
    ignore: bool,
) -> Result<(), String> {
    state.is_ignoring.store(ignore, Ordering::SeqCst);
    window
        .set_ignore_cursor_events(ignore)
        .map_err(|e| e.to_string())
}

#[tauri::command]
fn focus_window<R: Runtime>(
    state: tauri::State<Arc<AppState>>,
    window: tauri::WebviewWindow<R>,
) -> Result<(), String> {
    state.is_ignoring.store(false, Ordering::SeqCst);
    let _ = window.set_ignore_cursor_events(false);
    if window.is_minimized().unwrap_or(false) {
        let _ = window.unminimize();
    }
    if !window.is_visible().unwrap_or(true) {
        window.show().map_err(|e| e.to_string())?;
    }
    window.set_focus().map_err(|e| e.to_string())
}

#[tauri::command]
fn show_window<R: Runtime>(window: tauri::WebviewWindow<R>) -> Result<(), String> {
    if window.is_minimized().unwrap_or(false) {
        let _ = window.unminimize();
    }
    window.show().map_err(|e| e.to_string())?;
    window.set_focus().map_err(|e| e.to_string())
}

#[tauri::command]
fn hide_window<R: Runtime>(window: tauri::WebviewWindow<R>) -> Result<(), String> {
    window.hide().map_err(|e| e.to_string())
}

#[tauri::command]
fn toggle_window<R: Runtime>(window: tauri::WebviewWindow<R>) -> Result<(), String> {
    let is_minimized = window.is_minimized().unwrap_or(false);
    let is_visible = window.is_visible().unwrap_or(true);
    if is_visible && !is_minimized {
        window.hide().map_err(|e| e.to_string())
    } else {
        if is_minimized {
            let _ = window.unminimize();
        }
        window.show().map_err(|e| e.to_string())?;
        window.set_focus().map_err(|e| e.to_string())
    }
}

#[tauri::command]
fn quit_app(app: tauri::AppHandle) {
    app.exit(0);
}

pub fn run() {
    #[cfg(windows)]
    {
        // Aggressive RAM & Resource Optimization + Audio/Media Isolation for WebView2
        // Collapses multi-process overhead, restricts V8 heap to 64MB, and trims GPU/Network process footprint
        std::env::set_var(
            "WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS",
            "--in-process-gpu --enable-features=NetworkServiceInProcess --js-flags=--max-old-space-size=64 --disable-gpu-shader-disk-cache --disk-cache-size=1048576 --media-cache-size=1048576 --renderer-process-limit=1 --disable-background-networking --disable-default-apps --disable-extensions --disable-sync --disable-component-update --disable-speech-api --disable-backgrounding-occluded-windows --disable-renderer-backgrounding --disable-background-timer-throttling --disable-features=AudioServiceOutOfProcess,IsolateOrigins,site-per-process,CalculateNativeWinOcclusion,IntensiveWakeUpThrottling,ThrottleDisplayableMips,HardwareMediaKeyHandling,MediaSessionService,MediaSession,SystemMediaTransportControls,VolumeNotification,AudioDuckScreenReader,MediaEngagementBypassAutoplayPolicies,AudioDucking,EnableMediaSessionDuck,Win10MediaSession,Translate,AutofillServerCommunication,OptimizationHints,MediaRouter --disable-media-session-api --disable-background-media-suspend --autoplay-policy=no-user-gesture-required",
        );
    }

    let app_state = Arc::new(AppState::default());

    tauri::Builder::default()
        .manage(app_state.clone())
        .plugin(tauri_plugin_global_shortcut::Builder::new().build())
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![
            update_interactive_rects,
            set_ignore_cursor_events,
            focus_window,
            show_window,
            hide_window,
            toggle_window,
            quit_app,
            get_system_metrics
        ])
        .setup(move |app| {
            let app_state_thread = app_state.clone();
            let main_window = app.get_webview_window("main");

            #[cfg(windows)]
            {
                // Comprehensive Background Working Set Memory Trimmer:
                // Periodically trims physical RAM pages for the host process AND all child msedgewebview2 processes.
                std::thread::spawn(|| {
                    use windows_sys::Win32::Foundation::{CloseHandle, INVALID_HANDLE_VALUE};
                    use windows_sys::Win32::System::Diagnostics::ToolHelp::{
                        CreateToolhelp32Snapshot, Process32First, Process32Next, PROCESSENTRY32, TH32CS_SNAPPROCESS,
                    };
                    use windows_sys::Win32::System::Threading::{
                        GetCurrentProcess, GetCurrentProcessId, OpenProcess, SetProcessWorkingSetSize,
                        PROCESS_QUERY_INFORMATION, PROCESS_SET_QUOTA,
                    };

                    loop {
                        std::thread::sleep(std::time::Duration::from_secs(12));
                        unsafe {
                            let current_pid = GetCurrentProcessId();
                            let current_proc = GetCurrentProcess();
                            SetProcessWorkingSetSize(current_proc, usize::MAX, usize::MAX);

                            let snapshot = CreateToolhelp32Snapshot(TH32CS_SNAPPROCESS, 0);
                            if snapshot != INVALID_HANDLE_VALUE {
                                let mut entry: PROCESSENTRY32 = std::mem::zeroed();
                                entry.dwSize = std::mem::size_of::<PROCESSENTRY32>() as u32;

                                if Process32First(snapshot, &mut entry) != 0 {
                                    loop {
                                        if entry.th32ParentProcessID == current_pid {
                                            let child_handle = OpenProcess(
                                                PROCESS_SET_QUOTA | PROCESS_QUERY_INFORMATION,
                                                0,
                                                entry.th32ProcessID,
                                            );
                                            if !child_handle.is_null() {
                                                SetProcessWorkingSetSize(child_handle, usize::MAX, usize::MAX);
                                                CloseHandle(child_handle);
                                            }
                                        }
                                        if Process32Next(snapshot, &mut entry) == 0 {
                                            break;
                                        }
                                    }
                                }
                                CloseHandle(snapshot);
                            }
                        }
                    }
                });
            }

            #[cfg(windows)]
            if let Some(ref win) = main_window {
                // Ensure window is sized to non-occluding monitor bounds (1px offset, 4px clearance)
                // so Windows DWM & Chromium never consider background Chrome/Edge as 100% occluded.
                if let Ok(Some(monitor)) = win.primary_monitor() {
                    let size = monitor.size();
                    let scale = monitor.scale_factor();
                    let logical_w = (size.width as f64 / scale).round();
                    let logical_h = (size.height as f64 / scale).round();
                    let _ = win.set_position(tauri::Position::Logical(tauri::LogicalPosition { x: 1.0, y: 1.0 }));
                    let _ = win.set_size(tauri::Size::Logical(tauri::LogicalSize {
                        width: (logical_w - 2.0).max(800.0),
                        height: (logical_h - 4.0).max(600.0),
                    }));
                }
            }

            #[cfg(windows)]
            if let Some(win) = main_window.clone() {
                std::thread::spawn(move || {
                    use windows_sys::Win32::Foundation::POINT;
                    use windows_sys::Win32::UI::WindowsAndMessaging::GetCursorPos;

                    loop {
                        std::thread::sleep(std::time::Duration::from_millis(20));

                        let has_received = app_state_thread.has_received_rects.load(Ordering::SeqCst);
                        let force = app_state_thread.force_interactive.load(Ordering::SeqCst);

                        // If frontend hasn't initialized yet or force interactive is active:
                        // NEVER lock out mouse input. Keep window responsive so user can interact/close.
                        if !has_received || force {
                            if app_state_thread.is_ignoring.load(Ordering::SeqCst) {
                                let _ = win.set_ignore_cursor_events(false);
                                app_state_thread.is_ignoring.store(false, Ordering::SeqCst);
                            }
                            continue;
                        }

                        let mut pt = POINT { x: 0, y: 0 };
                        let success = unsafe { GetCursorPos(&mut pt) };
                        if success == 0 {
                            continue;
                        }

                        let cur_x = pt.x as f64;
                        let cur_y = pt.y as f64;

                        let is_inside = if let Ok(rects) = app_state_thread.interactive_rects.lock() {
                            rects.iter().any(|r| {
                                cur_x >= r.x && cur_x <= (r.x + r.width) && cur_y >= r.y && cur_y <= (r.y + r.height)
                            })
                        } else {
                            false
                        };

                        let currently_ignoring = app_state_thread.is_ignoring.load(Ordering::SeqCst);

                        if is_inside && currently_ignoring {
                            let _ = win.set_ignore_cursor_events(false);
                            app_state_thread.is_ignoring.store(false, Ordering::SeqCst);
                        } else if !is_inside && !currently_ignoring {
                            let _ = win.set_ignore_cursor_events(true);
                            app_state_thread.is_ignoring.store(true, Ordering::SeqCst);
                        }
                    }
                });
            }

            // System Tray Menu Setup
            let show_i = MenuItem::with_id(app, "show", "🌟 Show / Hide Lumen (Alt+L)", true, None::<&str>)?;
            let capture_i = MenuItem::with_id(app, "capture", "📝 Quick Note (Alt+N)", true, None::<&str>)?;
            let timer_i = MenuItem::with_id(app, "timer", "⏰ Quick Timer (Alt+T)", true, None::<&str>)?;
            let calendar_i = MenuItem::with_id(app, "calendar", "📅 Calendar & Agenda (Alt+C)", true, None::<&str>)?;
            let hub_i = MenuItem::with_id(app, "hub", "⚙️ Settings Hub (Alt+S)", true, None::<&str>)?;
            let update_i = MenuItem::with_id(app, "update", "🔄 Check for Updates... (Kiểm tra cập nhật)", true, None::<&str>)?;
            let quit_i = MenuItem::with_id(app, "quit", "✕ Quit Lumen", true, None::<&str>)?;
            let menu = Menu::with_items(app, &[&show_i, &capture_i, &timer_i, &calendar_i, &hub_i, &update_i, &quit_i])?;

            let mut tray_builder = TrayIconBuilder::with_id("lumen-tray-icon")
                .menu(&menu)
                .tooltip("Lumen — Desktop Spatial Companion");

            if let Some(icon) = app.default_window_icon() {
                tray_builder = tray_builder.icon(icon.clone());
            }

            let _tray = tray_builder
                .on_menu_event(|app, event| match event.id.as_ref() {
                    "show" => {
                        if let Some(window) = app.get_webview_window("main") {
                            let _ = toggle_window(window);
                        }
                    }
                    "capture" => {
                        if let Some(window) = app.get_webview_window("main") {
                            if window.is_minimized().unwrap_or(false) {
                                let _ = window.unminimize();
                            }
                            if !window.is_visible().unwrap_or(true) {
                                let _ = window.show();
                            }
                            let _ = window.set_focus();
                            let _ = window.emit("open-quick-capture", ());
                        }
                    }
                    "timer" => {
                        if let Some(window) = app.get_webview_window("main") {
                            if window.is_minimized().unwrap_or(false) {
                                let _ = window.unminimize();
                            }
                            if !window.is_visible().unwrap_or(true) {
                                let _ = window.show();
                            }
                            let _ = window.set_focus();
                            let _ = window.emit("open-quick-timer", ());
                        }
                    }
                    "calendar" => {
                        if let Some(window) = app.get_webview_window("main") {
                            if window.is_minimized().unwrap_or(false) {
                                let _ = window.unminimize();
                            }
                            if !window.is_visible().unwrap_or(true) {
                                let _ = window.show();
                            }
                            let _ = window.set_focus();
                            let _ = window.emit("open-calendar", ());
                        }
                    }
                    "hub" => {
                        if let Some(window) = app.get_webview_window("main") {
                            if window.is_minimized().unwrap_or(false) {
                                let _ = window.unminimize();
                            }
                            if !window.is_visible().unwrap_or(true) {
                                let _ = window.show();
                            }
                            let _ = window.set_focus();
                            let _ = window.emit("open-app-settings", ());
                        }
                    }
                    "update" => {
                        if let Some(window) = app.get_webview_window("main") {
                            if window.is_minimized().unwrap_or(false) {
                                let _ = window.unminimize();
                            }
                            if !window.is_visible().unwrap_or(true) {
                                let _ = window.show();
                            }
                            let _ = window.set_focus();
                            let _ = window.emit("open-check-updates", ());
                        }
                    }
                    "quit" => {
                        app.exit(0);
                    }
                    _ => {}
                })
                .on_tray_icon_event(|tray, event| {
                    if let TrayIconEvent::Click {
                        button: MouseButton::Left,
                        button_state: MouseButtonState::Up,
                        ..
                    } = event
                    {
                        let app = tray.app_handle();
                        if let Some(window) = app.get_webview_window("main") {
                            let _ = toggle_window(window);
                        }
                    }
                })
                .build(app)?;

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running lumen desktop native shell");
}

