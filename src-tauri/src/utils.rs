use chrono::{DateTime, Local, Utc};

fn bytes_to_gb(bytes: &u64) -> u16 {
    (bytes / (1e+9 as u64)) as u16
}

fn bytes_to_mb(bytes: &u64) -> u16 {
    (bytes / (1e+6 as u64)) as u16
}

fn bytes_to_kb(bytes: &u64) -> u16 {
    (bytes / (1e+3 as u64)) as u16
}

pub fn format_bytes(bytes: &u64) -> String {
    let gb = bytes_to_gb(&bytes);
    let mb = bytes_to_mb(&bytes);
    let kb = bytes_to_kb(&bytes);

    match gb {
        0 => match mb {
            0 => format!("{} KB", kb),
            _ => format!("{} MB", mb),
        },
        _ => format!("{} GB", gb),
    }
}

pub fn convert_utc_to_localtime(utc: DateTime<Utc>) -> String {
    let local: DateTime<Local> = DateTime::from(utc);
    // return string
    local.format("%Y-%w-%d %H:%M:%S").to_string()
}
