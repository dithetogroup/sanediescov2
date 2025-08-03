<?php
include_once("headers.php");
include_once("db_connect.php");

header("Content-Type: application/json");
$cr_esco_id = $_POST['esco_id'] ?? '';
$hasFile = isset($_FILES['cr_reference_letter']) && $_FILES['cr_reference_letter']['error'] === UPLOAD_ERR_OK;
$file_category = $_POST['file_category'] ?? 'Client Reference Letter';

$clientReference = [
    'cr_client_name' => $_POST['cr_client_name'] ?? '',
    'cr_contact_person' => $_POST['cr_contact_person'] ?? '',
    'cr_client_contact_no' => $_POST['cr_client_contact_no'] ?? '',
    'cr_proj_desc' => $_POST['cr_proj_desc'] ?? '',
    'cr_technologies' => $_POST['cr_technologies'] ?? '',
    'cr_proj_value' => isset($_POST['cr_proj_value']) && $_POST['cr_proj_value'] !== '' ? $_POST['cr_proj_value'] : null,
    'cr_start_date' => $_POST['cr_start_date'] ?? null,
    'cr_end_date' => $_POST['cr_end_date'] ?? null
];

$cr_id = $_POST['cr_id'] ?? null; // For updates

$mysqli->begin_transaction();

try {
    // Insert or Update client_reference
    if ($cr_id) {
        $stmt = $mysqli->prepare("UPDATE client_reference SET cr_client_name=?, cr_contact_person=?, cr_client_contact_no=?, cr_proj_desc=?, cr_technologies=?, cr_proj_value=?, cr_start_date=?, cr_end_date=? WHERE cr_id=?");
        $stmt->bind_param(
            "ssssssssi",
            $clientReference['cr_client_name'],
            $clientReference['cr_contact_person'],
            $clientReference['cr_client_contact_no'],
            $clientReference['cr_proj_desc'],
            $clientReference['cr_technologies'],
            $clientReference['cr_proj_value'],
            $clientReference['cr_start_date'],
            $clientReference['cr_end_date'],
            $cr_id
        );
        $stmt->execute();
        $stmt->close();
    } else {
        $stmt = $mysqli->prepare("INSERT INTO client_reference (cr_client_name, cr_contact_person, cr_client_contact_no, cr_proj_desc, cr_technologies, cr_proj_value, cr_start_date, cr_end_date, cr_esco_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->bind_param(
            "sssssssss",
            $clientReference['cr_client_name'],
            $clientReference['cr_contact_person'],
            $clientReference['cr_client_contact_no'],
            $clientReference['cr_proj_desc'],
            $clientReference['cr_technologies'],
            $clientReference['cr_proj_value'],
            $clientReference['cr_start_date'],
            $clientReference['cr_end_date'],
            $cr_esco_id
        );
        $stmt->execute();
        $cr_id = $stmt->insert_id;
        $stmt->close();
    }

    // File upload/association
    if ($hasFile) {
        $uploadDir = __DIR__ . "/uploads/";
        if (!file_exists($uploadDir)) mkdir($uploadDir, 0777, true);
        $originalName = basename($_FILES['cr_reference_letter']['name']);
        $ext = pathinfo($originalName, PATHINFO_EXTENSION);
        $newName = $cr_esco_id . '_clientreference_' . date('ymdHis') . '.' . $ext;
        $filePath = $uploadDir . $newName;
        $relativePath = "uploads/" . $newName;

        if (move_uploaded_file($_FILES['cr_reference_letter']['tmp_name'], $filePath)) {
            // Soft delete old files
            $mysqli->query("UPDATE files_upload SET fu_isRemoved=1 WHERE fu_cr_id = $cr_id");
            $stmt2 = $mysqli->prepare("INSERT INTO files_upload (fu_esco_id, fu_name, fu_size, fu_type, fu_path, fu_category, fu_isRemoved, fu_cr_id) VALUES (?, ?, ?, ?, ?, ?, 0, ?)");
            $fileSize = $_FILES['cr_reference_letter']['size'];
            $fileType = $_FILES['cr_reference_letter']['type'];
            $stmt2->bind_param("ssisssi", $cr_esco_id, $newName, $fileSize, $fileType, $relativePath, $file_category, $cr_id);
            $stmt2->execute();
            $stmt2->close();
        }
    }
    $mysqli->commit();
    echo json_encode(['status' => 'success', 'message' => $cr_id ? 'Updated!' : 'Saved!', 'cr_id' => $cr_id]);
} catch (Exception $e) {
    $mysqli->rollback();
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
?>
