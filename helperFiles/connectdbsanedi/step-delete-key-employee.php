<?php
include_once("headers.php");
include_once("db_connect.php");
header("Content-Type: application/json");

// Soft-delete
$stmt = $mysqli->prepare("UPDATE key_employee SET ke_isDeleted=1 WHERE ke_id=?");
$stmt->bind_param("i", $ke_id);
$stmt->execute();
$stmt->close();
// Optionally soft-delete associated files:
$mysqli->query("UPDATE files_upload SET fu_isRemoved=1 WHERE fu_ke_id = $ke_id");

?>
