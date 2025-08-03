<?php
include_once("headers.php");
include_once("db_connect.php");
header("Content-Type: application/json");

$esco_id = $_GET['esco_id'] ?? '';
$out = [];

error_log("[INFO] === Start Fetching Client References for ESCoID: $esco_id ===");

if (!$esco_id) {
    error_log("[ERROR] Missing esco_id in GET params");
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Missing esco_id']);
    exit;
}

try {
    $stmt = $mysqli->prepare("SELECT * FROM client_reference WHERE cr_esco_id=? AND cr_isDeleted=0 ORDER BY cr_id DESC");
    if (!$stmt) {
        error_log("[ERROR] Prepare failed: " . $mysqli->error);
        throw new Exception("Database prepare failed: " . $mysqli->error);
    }
    $stmt->bind_param("s", $esco_id);
    if (!$stmt->execute()) {
        error_log("[ERROR] Execute failed: " . $stmt->error);
        throw new Exception("Database execute failed: " . $stmt->error);
    }
    $res = $stmt->get_result();

    while ($row = $res->fetch_assoc()) {
        $cr_id = $row['cr_id'];
        error_log("[INFO] Processing client_reference.cr_id = $cr_id");
        // Get file info
        $fileres = $mysqli->query("SELECT * FROM files_upload WHERE fu_cr_id=$cr_id AND fu_isRemoved=0 LIMIT 1");
        if (!$fileres) {
            error_log("[ERROR] File query failed for fu_cr_id=$cr_id: " . $mysqli->error);
            $row['reference_letter'] = null;
        } else {
            $row['reference_letter'] = $fileres->fetch_assoc();
            if ($row['reference_letter']) {
                error_log("[INFO] Found reference letter for cr_id=$cr_id: " . $row['reference_letter']['fu_name']);
            } else {
                error_log("[INFO] No reference letter for cr_id=$cr_id");
            }
        }
        $out[] = $row;
    }
    
    $stmt->close();
    error_log("[INFO] === Done fetching client references for ESCoID: $esco_id ===");
    echo json_encode(['status' => 'success', 'references' => $out]);
} catch (Exception $e) {
    error_log("[ERROR] Exception occurred: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
?>
