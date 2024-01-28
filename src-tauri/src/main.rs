// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod utils;
mod volumes;

use volumes::get_volumes;

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![get_volumes])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
