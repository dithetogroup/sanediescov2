<?php
include_once("headers.php");
include_once("db_connect.php");
header("Content-Type: application/json");

error_log("[INFO] === Start Technology Classification Soft Delete ===");

// Accept JSON payload (POST: { tc_id: ... })
$raw = file_get_contents('php://input');
$input = json_decode($raw, true);
$tc_id = $input['tc_id'] ?? null;

if (!$tc_id) {
    error_log("[ERROR] No tc_id supplied for delete: " . $raw);
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Missing tc_id']);
    exit;
}

try {
    $stmt = $mysqli->prepare("UPDATE technology_classification SET tc_is_deleted=1 WHERE tc_id=?");
    $stmt->bind_param("i", $tc_id);
    if ($stmt->execute()) {
        error_log("[INFO] Soft deleted tc_id=$tc_id");
        echo json_encode(['status' => 'success', 'message' => 'Technology classification soft-deleted']);
    } else {
        error_log("[ERROR] Soft delete failed for tc_id=$tc_id: " . $stmt->error);
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Delete failed: ' . $stmt->error]);
    }
    $stmt->close();
} catch (Exception $e) {
    error_log("[ERROR] Delete exception: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
?>
