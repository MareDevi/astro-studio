use log::info;
use std::path::Path;

/// Detects the package manager used in a project by checking for lock files.
/// Returns the name of the package manager executable (e.g., "npm", "yarn", "pnpm", "bun").
pub fn detect_package_manager(project_path: &str) -> String {
    let path = Path::new(project_path);

    // Check for lock files in order of common preference
    if path.join("bun.lockb").exists() || path.join("bun.lock").exists() {
        info!("Detected bun package manager via lock file");
        return "bun".to_string();
    }

    if path.join("pnpm-lock.yaml").exists() {
        info!("Detected pnpm package manager via lock file");
        return "pnpm".to_string();
    }

    if path.join("yarn.lock").exists() {
        info!("Detected yarn package manager via lock file");
        return "yarn".to_string();
    }

    if path.join("package-lock.json").exists() {
        info!("Detected npm package manager via lock file");
        return "npm".to_string();
    }

    // Default to npm if no lock file is found
    info!("No lock file found, defaulting to npm package manager");
    "npm".to_string()
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::fs;
    use tempfile::tempdir;

    #[test]
    fn test_detect_bun() {
        let dir = tempdir().unwrap();
        let path = dir.path();
        fs::File::create(path.join("bun.lockb")).unwrap();

        assert_eq!(detect_package_manager(path.to_str().unwrap()), "bun");
    }

    #[test]
    fn test_detect_pnpm() {
        let dir = tempdir().unwrap();
        let path = dir.path();
        fs::File::create(path.join("pnpm-lock.yaml")).unwrap();

        assert_eq!(detect_package_manager(path.to_str().unwrap()), "pnpm");
    }

    #[test]
    fn test_detect_yarn() {
        let dir = tempdir().unwrap();
        let path = dir.path();
        fs::File::create(path.join("yarn.lock")).unwrap();

        assert_eq!(detect_package_manager(path.to_str().unwrap()), "yarn");
    }

    #[test]
    fn test_detect_npm() {
        let dir = tempdir().unwrap();
        let path = dir.path();
        fs::File::create(path.join("package-lock.json")).unwrap();

        assert_eq!(detect_package_manager(path.to_str().unwrap()), "npm");
    }

    #[test]
    fn test_detect_default_npm() {
        let dir = tempdir().unwrap();
        let path = dir.path();

        assert_eq!(detect_package_manager(path.to_str().unwrap()), "npm");
    }
}
