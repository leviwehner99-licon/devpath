use tauri::Manager;

#[tauri::command]
fn app_version() -> String {
    env!("CARGO_PKG_VERSION").to_string()
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        // The builder forwards Windows/Linux second-instance URLs to the deep-link plugin
        // before this callback. Bring the original window forward after the browser returns.
        .plugin(
            tauri_plugin_single_instance::Builder::new()
                .callback(|app, _argv, _cwd| {
                    if let Some(window) = app.get_webview_window("main") {
                        let _ = window.show();
                        let _ = window.set_focus();
                    }
                })
                .build(),
        )
        .plugin(tauri_plugin_deep_link::init())
        .plugin(tauri_plugin_opener::init())
        // The frontend performs an idempotent, data-preserving app_state schema
        // upgrade. This avoids SQLx checksum locks on existing local databases.
        .plugin(tauri_plugin_sql::Builder::default().build())
        .invoke_handler(tauri::generate_handler![app_version])
        .run(tauri::generate_context!())
        .expect("CodeZone konnte nicht gestartet werden");
}
