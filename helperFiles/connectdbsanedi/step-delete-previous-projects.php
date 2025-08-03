<?php
include_once("headers.php");
include_once("db_connect.php");
header("Content-Type: application/json");

error_log("[INFO] === Start Previous Project Delete ===");

$pp_id = $_POST['pp_id'] ?? '';
if (!$pp_id) {
    error_log("[ERROR] Missing pp_id in request: " . json_encode($_POST));
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Missing pp_id']);
    exit;
}

try {
    // 1. Soft-delete the project
    $stmt = $mysqli->prepare("UPDATE previous_projects SET pp_isDeleted = 1 WHERE pp_id = ?");
    if (!$stmt) {
        error_log("[ERROR] Prepare failed for previous_projects: " . $mysqli->error);
        throw new Exception("Prepare failed for previous_projects: " . $mysqli->error);
    }
    $stmt->bind_param("i", $pp_id);
    if (!$stmt->execute()) {
        error_log("[ERROR] Execute failed for previous_projects: " . $stmt->error);
        throw new Exception("Failed to soft-delete project: " . $stmt->error);
    }
    $stmt->close();
    error_log("[INFO] Soft-deleted previous_projects for pp_id: $pp_id");

    // 2. Soft-delete all files linked to this project
    $fileStmt = $mysqli->prepare("UPDATE files_upload SET fu_isRemoved = 1 WHERE fu_pp_id = ?");
    if (!$fileStmt) {
        error_log("[ERROR] Prepare failed for files_upload: " . $mysqli->error);
        throw new Exception("Prepare failed for files_upload: " . $mysqli->error);
    }
    $fileStmt->bind_param("i", $pp_id);
    if (!$fileStmt->execute()) {
        error_log("[ERROR] Execute failed for files_upload for pp_id: $pp_id | Error: " . $fileStmt->error);
        throw new Exception("Failed to soft-delete files_upload: " . $fileStmt->error);
    }
    $affectedFiles = $fileStmt->affected_rows;
    $fileStmt->close();
    error_log("[INFO] Soft-deleted $affectedFiles files_upload rows for pp_id: $pp_id");

    echo json_encode(['status' => 'success', 'message' => 'Project and linked files deleted']);

} catch (Exception $e) {
    error_log("[ERROR] Exception: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
?>
