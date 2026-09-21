// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    #[cfg(windows)]
    {
        // Aggressive RAM & Resource Optimization + Audio/Media Isolation for WebView2
        // Collapses multi-process overhead, restricts V8 heap to 64MB, and trims GPU/Network process footprint
        std::env::set_var(
            "WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS",
            "--in-process-gpu --enable-features=NetworkServiceInProcess --js-flags=--max-old-space-size=64 --disable-gpu-shader-disk-cache --disk-cache-size=1048576 --media-cache-size=1048576 --renderer-process-limit=1 --disable-background-networking --disable-default-apps --disable-extensions --disable-sync --disable-component-update --disable-speech-api --disable-backgrounding-occluded-windows --disable-renderer-backgrounding --disable-background-timer-throttling --disable-features=AudioServiceOutOfProcess,IsolateOrigins,site-per-process,CalculateNativeWinOcclusion,IntensiveWakeUpThrottling,ThrottleDisplayableMips,HardwareMediaKeyHandling,MediaSessionService,MediaSession,SystemMediaTransportControls,VolumeNotification,AudioDuckScreenReader,MediaEngagementBypassAutoplayPolicies,AudioDucking,EnableMediaSessionDuck,Win10MediaSession,Translate,AutofillServerCommunication,OptimizationHints,MediaRouter --disable-media-session-api --disable-background-media-suspend --autoplay-policy=no-user-gesture-required",
        );
    }

    std::panic::set_hook(Box::new(|info| {
        let msg = format!("PANIC: {:?}\nLocation: {:?}", info.payload().downcast_ref::<&str>(), info.location());
        let _ = std::fs::write("tauri_panic.log", msg.clone());
        let _ = std::fs::write("D:\\Demo\\cliff-clover-moon-tundra\\tauri_panic.log", msg);
    }));
    lumen_lib::run();
}
