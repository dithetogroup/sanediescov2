<?php
include_once("headers.php");
include_once("db_connect.php");
header("Content-Type: application/json");

error_log("[INFO] === Start Sector Experience Delete ===");

// Accept either POST or GET, prefer POST
$se_id = $_POST['se_id'] ?? $_GET['se_id'] ?? null;

if (!$se_id) {
    error_log("[ERROR] Missing required: se_id");
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Missing required field: se_id']);
    exit;
}

try {
    $stmt = $mysqli->prepare("UPDATE sector_experience SET se_isDeleted = 1 WHERE se_id = ?");
    if (!$stmt) {
        throw new Exception("Prepare failed: " . $mysqli->error);
    }
    $stmt->bind_param("i", $se_id);
    if (!$stmt->execute()) {
        $stmt->close();
        throw new Exception("Delete failed: " . $stmt->error);
    }
    $affected = $stmt->affected_rows;
    $stmt->close();

    if ($affected > 0) {
        error_log("[INFO] Soft-deleted sector_experience se_id=$se_id");
        echo json_encode(['status' => 'success', 'message' => 'Sector Experience deleted']);
    } else {
        error_log("[INFO] No rows affected for se_id=$se_id (maybe already deleted or not found).");
        echo json_encode(['status' => 'success', 'message' => 'No change (not found or already deleted)']);
    }
} catch (Exception $e) {
    error_log("[ERROR] " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
