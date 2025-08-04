<?php
include_once("headers.php");
include_once("db_connect.php");
header("Content-Type: application/json");

$esco_id = $_GET['esco_id'] ?? '';
$out = [];
$stmt = $mysqli->prepare("SELECT * FROM key_employee WHERE ke_esco_id=? AND ke_isDeleted=0 ORDER BY ke_id DESC");
$stmt->bind_param("s", $esco_id);
$stmt->execute();
$res = $stmt->get_result();
while ($row = $res->fetch_assoc()) {
    $ke_id = $row['ke_id'];
    // CV
    $row['cv'] = null;
    $cvres = $mysqli->query("SELECT * FROM files_upload WHERE fu_ke_id=$ke_id AND fu_type='cv' AND fu_isRemoved=0 LIMIT 1");
    if ($cvres) $row['cv'] = $cvres->fetch_assoc();

    // Multiple certifications
    $certs = [];
    $certres = $mysqli->query("SELECT * FROM files_upload WHERE fu_ke_id=$ke_id AND fu_type='certification' AND fu_isRemoved=0");
    if ($certres) while($c = $certres->fetch_assoc()) $certs[] = $c;
    $row['certifications'] = $certs;

    // EPC letter
    $row['epc_letter'] = null;
    $epcres = $mysqli->query("SELECT * FROM files_upload WHERE fu_ke_id=$ke_id AND fu_type='epc_letter' AND fu_isRemoved=0 LIMIT 1");
    if ($epcres) $row['epc_letter'] = $epcres->fetch_assoc();

    $out[] = $row;
}
$stmt->close();
echo json_encode(['status'=>'success', 'key_employees'=>$out]);
?>
