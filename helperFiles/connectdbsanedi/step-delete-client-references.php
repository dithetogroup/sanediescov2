<?php
include_once("headers.php");
include_once("db_connect.php");
header("Content-Type: application/json");

// Log script start
error_log("[INFO] === Client Reference Soft Delete Script Start ===");
$cr_id = $_POST['cr_id'] ?? '';
$cr_esco_id = $_POST['esco_id'] ?? '';

if (!$cr_id || !$cr_esco_id) {
    error_log("[ERROR] Missing required fields: cr_id=$cr_id esco_id=$cr_esco_id");
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Missing required fields']);
    exit;
}

$mysqli->begin_transaction();
try {
    // 1. Soft-delete the client_reference row
    $stmt = $mysqli->prepare("UPDATE client_reference SET cr_isDeleted = 1 WHERE cr_id = ? AND cr_esco_id = ?");
    $stmt->bind_param("is", $cr_id, $cr_esco_id);
    if (!$stmt->execute()) throw new Exception("Soft-delete client_reference: " . $stmt->error);
    $stmt->close();
    error_log("[INFO] Soft-deleted client_reference cr_id=$cr_id, esco_id=$cr_esco_id");

    // 2. Soft-delete associated file(s)
    $stmt2 = $mysqli->prepare("UPDATE files_upload SET fu_isRemoved = 1 WHERE fu_cr_id = ?");
    $stmt2->bind_param("i", $cr_id);
    if (!$stmt2->execute()) throw new Exception("Soft-delete files_upload: " . $stmt2->error);
    $stmt2->close();
    error_log("[INFO] Soft-deleted associated files_upload for cr_id=$cr_id");

    $mysqli->commit();
    echo json_encode(['status' => 'success', 'message' => 'Client Reference deleted!']);
} catch (Exception $e) {
    $mysqli->rollback();
    error_log("[ERROR] Exception during soft-delete: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
?>
