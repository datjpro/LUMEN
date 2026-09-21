// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    #[cfg(windows)]
    {
        // Disable Chromium hardware media key handling, media session service, and audio ducking so background videos/audio in browser or player are never paused on interaction
        std::env::set_var(
            "WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS",
            "--disable-features=HardwareMediaKeyHandling,MediaSessionService,VolumeNotification,AudioDuckScreenReader --autoplay-policy=no-user-gesture-required",
        );
    }

    std::panic::set_hook(Box::new(|info| {
        let msg = format!("PANIC: {:?}\nLocation: {:?}", info.payload().downcast_ref::<&str>(), info.location());
        let _ = std::fs::write("tauri_panic.log", msg.clone());
        let _ = std::fs::write("D:\\Demo\\cliff-clover-moon-tundra\\tauri_panic.log", msg);
    }));
    lumen_lib::run();
}

