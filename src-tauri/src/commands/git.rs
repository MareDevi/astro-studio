use std::process::Command;
use tauri::command;

#[command]
#[specta::specta]
pub fn git_status(project_path: String) -> Result<String, String> {
    let output = Command::new("git")
        .current_dir(&project_path)
        .arg("status")
        .arg("--porcelain")
        .output()
        .map_err(|e| format!("Failed to execute git status: {}", e))?;

    if output.status.success() {
        Ok(String::from_utf8_lossy(&output.stdout).to_string())
    } else {
        Err(String::from_utf8_lossy(&output.stderr).to_string())
    }
}

#[command]
#[specta::specta]
pub fn git_commit(project_path: String, message: String) -> Result<String, String> {
    let add_output = Command::new("git")
        .current_dir(&project_path)
        .arg("add")
        .arg(".")
        .output()
        .map_err(|e| format!("Failed to execute git add: {}", e))?;

    if !add_output.status.success() {
        return Err(String::from_utf8_lossy(&add_output.stderr).to_string());
    }

    let commit_output = Command::new("git")
        .current_dir(&project_path)
        .arg("commit")
        .arg("-m")
        .arg(&message)
        .output()
        .map_err(|e| format!("Failed to execute git commit: {}", e))?;

    if commit_output.status.success() {
        Ok(String::from_utf8_lossy(&commit_output.stdout).to_string())
    } else {
        Err(String::from_utf8_lossy(&commit_output.stderr).to_string())
    }
}

#[command]
#[specta::specta]
pub fn git_push(project_path: String) -> Result<String, String> {
    let output = Command::new("git")
        .current_dir(&project_path)
        .arg("push")
        .output()
        .map_err(|e| format!("Failed to execute git push: {}", e))?;

    if output.status.success() {
        Ok(String::from_utf8_lossy(&output.stdout).to_string())
    } else {
        Err(String::from_utf8_lossy(&output.stderr).to_string())
    }
}

#[command]
#[specta::specta]
pub fn git_pull(project_path: String) -> Result<String, String> {
    let output = Command::new("git")
        .current_dir(&project_path)
        .arg("pull")
        .output()
        .map_err(|e| format!("Failed to execute git pull: {}", e))?;

    if output.status.success() {
        Ok(String::from_utf8_lossy(&output.stdout).to_string())
    } else {
        Err(String::from_utf8_lossy(&output.stderr).to_string())
    }
}
