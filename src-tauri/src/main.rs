// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod directory;
mod utils;
mod volumes;

use directory::read_directory;
use volumes::get_volumes;
fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![get_volumes, read_directory])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
