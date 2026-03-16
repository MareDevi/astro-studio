pub mod path;
pub mod shell;
pub mod project;

pub use path::serialize_path;
pub use project::detect_package_manager;
