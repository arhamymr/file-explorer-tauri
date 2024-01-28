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
    mount_point: PathBuf,
    available_space: String,
    total_space: String,
    disk_usage: DiskUsage,
}

fn bytes_to_gb(bytes: &u64) -> u16 {
    (bytes / (1e+9 as u64)) as u16
}

fn bytes_to_mb(bytes: &u64) -> u16 {
    (bytes / (1e+6 as u64)) as u16
}

fn format_bytes(bytes: &u64) -> String {
    let gb = bytes_to_gb(&bytes);
    let mb = bytes_to_mb(&bytes);
    match gb {
        0 => format!("{} MB", mb),
        _ => format!("{} GB", gb),
    }
}

#[derive(serde::Serialize)]
struct DiskUsage {
    used: String,
    percentage: u8,
}

fn format_disk_usage(available_space: &u64, &total_space: &u64) -> DiskUsage {
    let used = total_space - available_space;
    let total = total_space.clone() as f64;

    DiskUsage {
        used: format_bytes(&used),
        percentage: ((used as f64 / total as f64) * 100 as f64).floor() as u8,
    }
}

#[tauri::command]
fn get_volumes() -> Vec<Directory> {
    let mut sys = System::new_all();

    sys.refresh_all();

    let mut volumes: Vec<Directory> = Vec::new();
    let disks = Disks::new_with_refreshed_list();

    for disk in &disks {
        let available_space = disk.available_space();
        let total_space = disk.total_space();

        volumes.push(Directory {
            name: {
                let name = disk.name().to_str().unwrap();
                match name.is_empty() {
                    true => "Local Volume",
                    false => name,
                }
                .to_string()
            },
            mount_point: disk.mount_point().to_path_buf(),
            available_space: format_bytes(&available_space),
            total_space: format_bytes(&total_space),
            disk_usage: format_disk_usage(&available_space, &total_space),
        });
    }
    volumes
}
