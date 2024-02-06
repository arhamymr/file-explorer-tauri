use serde::Serialize;
use std::fs;
use std::path::PathBuf;
use std::sync::{Arc, Mutex};
use std::thread;

use crate::utils::{convert_utc_to_localtime, format_bytes};

#[derive(Debug, Serialize)]
pub struct DirMetadata {
    is_dir: bool,
    is_file: bool,
    modified: String,
    accessed: String,
    created: String,
}

#[derive(Debug, Serialize)]
pub struct FileItem {
    name: String,
    path: PathBuf,
    size: String,
    metadata: DirMetadata,
    permission: bool,
}

// create a new folder
#[tauri::command]
pub fn create_directory(path: &str, folder_name: &str) -> Result<(), String> {
    let mut new_folder = format!("{}/{}", path, folder_name);

    let mut count = 1;
    while fs::metadata(&new_folder).is_ok() {
        new_folder = format!("{}/{} {}", path, folder_name, count);
        count += 1;
    }

    match fs::create_dir(new_folder) {
        Ok(_) => Ok(()),
        Err(err) => Err(format!("failed to create directory {}", err)),
    }
}

// #[tauri::command]
// pub fn delete_file(path: &str) -> bool {
//     if let Ok(_) = fs::remove_file(path) {
//         return true;
//     }
//     false
// }

fn filter_files(entry: &fs::DirEntry) -> bool {
    let file_name = entry.file_name();

    if let Ok(metadata) = entry.metadata() {
        if !metadata.is_dir() && !metadata.is_file() {
            return false;
        }
    }

    if let Some(file_name_str) = file_name.to_str() {
        if file_name_str.starts_with('.') {
            return false;
        }
    }
    true
}

fn filter_search_files(entry: &fs::DirEntry, keyword: &str) -> bool {
    let file_name = entry.file_name().to_string_lossy().to_lowercase();

    if file_name.contains(keyword.to_lowercase().as_str()) {
        return true;
    }

    false
}

// show directory contents
#[tauri::command]
pub fn read_directory(path: &str) -> Vec<FileItem> {
    let mut result = Vec::new();

    if let Ok(entries) = fs::read_dir(path) {
        for entry in entries {
            if let Ok(entry) = entry {
                println!("Reading directory: {:?}", entry);
                let file_name = entry.file_name();
                let metadata = entry.metadata().unwrap();
                let entry_path = entry.path();
                let readonly = metadata.permissions().readonly();

                let dirmetadata = get_metadata(&metadata);

                if filter_files(&entry) {
                    result.push(FileItem {
                        name: file_name.to_string_lossy().into_owned(),
                        path: entry_path,
                        size: format_bytes(&metadata.len()),
                        metadata: dirmetadata,
                        permission: readonly,
                    });
                }
            }
        }
    }
    result
}

// search for files
#[tauri::command]
pub fn search_file(path: &str, keyword: &str) -> Vec<FileItem> {
    let mut result: Vec<FileItem> = Vec::new();

    if let Ok(entries) = fs::read_dir(path) {
        thread::spawn(move || {
            for entry in entries {
                if let Ok(entry) = entry {
                    let file_name = entry.file_name();
                    let metadata = entry.metadata().unwrap();
                    let entry_path = entry.path();
                    let readonly = metadata.permissions().readonly();

                    let dirmetadata = get_metadata(&metadata);

                    // if filter_search_files(&entry, keyword.clone()) {
                    //     let clone_path = entry_path.clone();
                    //     result.push(FileItem {
                    //         name: file_name.to_string_lossy().into_owned(),
                    //         path: clone_path,
                    //         size: format_bytes(&metadata.len()),
                    //         metadata: dirmetadata,
                    //         permission: readonly,
                    //     });
                    // }

                    // if metadata.is_dir() {
                    //     match entry_path.to_str() {
                    //         Some(s) => search_file(&s, keyword),
                    //         None => {
                    //             println!("Invalid unicode in path: {:?}", entry_path);
                    //             continue;
                    //         }
                    //     };
                    // } else {
                    //     println!("Not a directory");
                    // }

                    // add condtion to stop stackoverflow
                }
            }
        });
    }
    result
}

fn get_metadata(metadata: &fs::Metadata) -> DirMetadata {
    let dirmetadata = DirMetadata {
        is_dir: metadata.is_dir(),
        is_file: metadata.is_file(),
        modified: convert_utc_to_localtime(metadata.modified().unwrap().into()),
        accessed: convert_utc_to_localtime(metadata.accessed().unwrap().into()),
        created: convert_utc_to_localtime(metadata.created().unwrap().into()),
    };
    dirmetadata
}
