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

// Get all company_information history for this ESCo, including deleted (for audit)
$stmt = $mysqli->prepare("
    SELECT ci.*, fu.fu_id, fu.fu_name, fu.fu_path, fu.fu_type, fu.fu_size, fu.fu_category, fu.uploaded_at
    FROM company_information ci
    LEFT JOIN files_upload fu ON fu.fu_ci_id = ci.ci_id AND fu.fu_isRemoved = 0
    WHERE ci.ci_esco_id = ?
    ORDER BY ci.ci_created_at DESC
");
$stmt->bind_param("s", $esco_id);
$stmt->execute();
$result = $stmt->get_result();

$rows = [];
while ($row = $result->fetch_assoc()) {
    $rows[] = $row;
}
$stmt->close();

echo json_encode(['status' => 'success', 'history' => $rows]);
?>
