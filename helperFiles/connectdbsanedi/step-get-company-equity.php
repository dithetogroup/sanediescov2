<?php
include_once("headers.php");
include_once("db_connect.php");
header("Content-Type: application/json");

$ce_esco_id = $_GET['esco_id'] ?? '';
if (!$ce_esco_id) {
    http_response_code(400);
    echo json_encode(['status'=>'error','message'=>'Missing esco_id']);
    exit;
}

$stmt = $mysqli->prepare("SELECT * FROM company_equity WHERE ce_esco_id=? AND ce_isDeleted=0 ORDER BY ce_last_updated_date DESC LIMIT 1");
$stmt->bind_param("s", $ce_esco_id);
$stmt->execute();
$res = $stmt->get_result();
$data = $res->fetch_assoc();
$stmt->close();

// Fetch latest BEE cert file (if any)
if ($data) {
    $ce_id = $data['ce_id'];
    $fileres = $mysqli->prepare("SELECT * FROM files_upload WHERE fu_ce_id=? AND fu_isRemoved=0 ORDER BY uploaded_at DESC LIMIT 1");
    $fileres->bind_param("i", $ce_id);
    $fileres->execute();
    $fileResult = $fileres->get_result();
    $data['bee_certificate'] = $fileResult->fetch_assoc();
    $fileres->close();
}

echo json_encode(['status'=>'success', 'company_equity'=>$data]);
?>
