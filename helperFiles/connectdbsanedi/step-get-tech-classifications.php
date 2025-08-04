<?php
include_once("headers.php");
include_once("db_connect.php");

header("Content-Type: application/json");

error_log("[INFO] === Start Technology Classification Fetch ===");

$esco_id = $_GET['esco_id'] ?? '';
if (!$esco_id) {
    error_log("[ERROR] Missing esco_id in GET params");
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Missing esco_id']);
    exit;
}

try {
    $stmt = $mysqli->prepare("SELECT * FROM technology_classification WHERE esco_id=? AND tc_is_deleted=0");
    $stmt->bind_param("s", $esco_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $rows = [];
    while ($row = $result->fetch_assoc()) {
        $rows[] = $row;
    }
    $stmt->close();
    error_log("[INFO] Fetched " . count($rows) . " technology_classification rows for esco_id=$esco_id");
    echo json_encode(['status' => 'success', 'data' => $rows]);
} catch (Exception $e) {
    error_log("[ERROR] Fetch failed: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
?>
