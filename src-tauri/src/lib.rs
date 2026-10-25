#[tauri::command]
fn app_version() -> String {
    env!("CARGO_PKG_VERSION").to_string()
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let migrations = vec![
        tauri_plugin_sql::Migration {
            version: 1,
            description: "initial_local_learning_schema",
            sql: include_str!("../migrations/001_initial.sql"),
            kind: tauri_plugin_sql::MigrationKind::Up,
        },
        tauri_plugin_sql::Migration {
            version: 2,
            description: "account_scoped_local_learning_state",
            sql: include_str!("../migrations/002_account_scoped_state.sql"),
            kind: tauri_plugin_sql::MigrationKind::Up,
        },
    ];

    tauri::Builder::default()
        // Use the plugin's default callback: with the `deep-link` feature enabled it forwards
        // Windows/Linux second-instance command-line URLs to the deep-link plugin. A custom
        // empty callback here silently discarded OAuth callbacks while CodeZone was already open.
        .plugin(tauri_plugin_single_instance::Builder::new().build())
        .plugin(tauri_plugin_deep_link::init())
        .plugin(tauri_plugin_opener::init())
        .plugin(
            tauri_plugin_sql::Builder::default()
                .add_migrations("sqlite:devpath.db", migrations)
                .build(),
        )
        .invoke_handler(tauri::generate_handler![app_version])
        .run(tauri::generate_context!())
        .expect("CodeZone konnte nicht gestartet werden");
}
