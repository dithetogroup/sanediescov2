<?php
include_once("headers.php");
include_once("db_connect.php");

header("Content-Type: application/json");

$esco_id = $_GET['esco_id'] ?? '';
if (!$esco_id) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Missing esco_id']);
    exit;
}

// Fetch the latest (active) company_information record for this ESCo
$stmt = $mysqli->prepare("
    SELECT * FROM company_information 
    WHERE ci_esco_id = ? AND ci_isDeleted = 0
    ORDER BY ci_updated_date DESC
    LIMIT 1
");
$stmt->bind_param("s", $esco_id);
$stmt->execute();
$result = $stmt->get_result();
$data = $result->fetch_assoc();

if ($data) {
    echo json_encode(['status' => 'success', 'data' => $data]);
} else {
    echo json_encode(['status' => 'error', 'message' => 'No record found for this ESCo']);
}
$stmt->close();
?>
