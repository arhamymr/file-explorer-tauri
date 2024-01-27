// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::path::PathBuf;

use sysinfo::{Disks, System};

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            greet,
            another_function,
            get_volumes
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}!", name)
}

#[tauri::command]
fn another_function() -> String {
    format!("Another function.")
}

#[derive(serde::Serialize)]
struct Directory {
    name: String,
    path: PathBuf,
}

#[tauri::command]
fn get_volumes() -> Vec<Directory> {
    let mut sys = System::new_all();

    sys.refresh_all();

    let mut volumes: Vec<Directory> = Vec::new();
    let disks = Disks::new_with_refreshed_list();

    for disk in &disks {
        volumes.push(Directory {
            name: {
                let name = disk.name().to_str().unwrap();
                match name.is_empty() {
                    true => "Local Volume",
                    false => name,
                }
                .to_string()
            },
            path: disk.mount_point().to_path_buf(),
        });
    }
    volumes
}
