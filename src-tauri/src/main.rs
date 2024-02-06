// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod file_system;
mod utils;
mod volumes;

use file_system::{create_directory, read_directory, search_file};
use volumes::get_volumes;

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            create_directory,
            get_volumes,
            read_directory,
            search_file,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
