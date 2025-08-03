<?php
include_once("headers.php");
include_once("db_connect.php");

header("Content-Type: application/json");

// 1. Log start
error_log("[INFO] === Start Client Reference Save/Update ===");

// 2. Gather POST/FILES
$cr_esco_id = $_POST['esco_id'] ?? '';
$hasFile = isset($_FILES['cr_reference_letter']) && $_FILES['cr_reference_letter']['error'] === UPLOAD_ERR_OK;
$file_category = $_POST['file_category'] ?? 'Client Reference Letter';

error_log("[INFO] Received POST keys: " . json_encode(array_keys($_POST)));
error_log("[INFO] Received FILES: " . json_encode(array_keys($_FILES)));

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
    if ($cr_id) {
        // UPDATE
        error_log("[INFO] Updating client_reference cr_id=$cr_id for ESCoID=$cr_esco_id");
        $stmt = $mysqli->prepare("UPDATE client_reference SET cr_client_name=?, cr_contact_person=?, cr_client_contact_no=?, cr_proj_desc=?, cr_technologies=?, cr_proj_value=?, cr_start_date=?, cr_end_date=? WHERE cr_id=?");
        if (!$stmt) throw new Exception("Prepare failed for update: " . $mysqli->error);
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
        if (!$stmt->execute()) throw new Exception("Execute failed for update: " . $stmt->error);
        $stmt->close();
        error_log("[INFO] Updated client_reference row cr_id=$cr_id");
    } else {
        // INSERT
        error_log("[INFO] Inserting new client_reference for ESCoID=$cr_esco_id");
        $stmt = $mysqli->prepare("INSERT INTO client_reference (cr_client_name, cr_contact_person, cr_client_contact_no, cr_proj_desc, cr_technologies, cr_proj_value, cr_start_date, cr_end_date, cr_esco_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
        if (!$stmt) throw new Exception("Prepare failed for insert: " . $mysqli->error);
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
        if (!$stmt->execute()) throw new Exception("Execute failed for insert: " . $stmt->error);
        $cr_id = $stmt->insert_id;
        $stmt->close();
        error_log("[INFO] Inserted new client_reference row cr_id=$cr_id");
    }

    // File upload/association
    if ($hasFile) {
        $uploadDir = __DIR__ . "/uploads/";
        if (!file_exists($uploadDir)) {
            if (!mkdir($uploadDir, 0777, true)) {
                error_log("[ERROR] Failed to create upload directory: $uploadDir");
                throw new Exception("Failed to create upload directory: $uploadDir");
            }
        }
        $originalName = basename($_FILES['cr_reference_letter']['name']);
        $ext = pathinfo($originalName, PATHINFO_EXTENSION);
        $newName = $cr_esco_id . '_CLIENTREF_' . date('ymdHis') . '.' . $ext;
        $filePath = $uploadDir . $newName;
        $relativePath = "uploads/" . $newName;

        error_log("[INFO] Moving uploaded file to: $filePath");

        if (move_uploaded_file($_FILES['cr_reference_letter']['tmp_name'], $filePath)) {
            // Soft delete old files for this cr_id
            error_log("[INFO] Soft deleting previous files_upload rows for cr_id=$cr_id");
            $mysqli->query("UPDATE files_upload SET fu_isRemoved=1 WHERE fu_cr_id = $cr_id");
            
            error_log("[DEBUG] cr_id at file insert: $cr_id (should exist in client_reference!)");

            $stmt2 = $mysqli->prepare("INSERT INTO files_upload (fu_esco_id, fu_name, fu_size, fu_type, fu_path, fu_category, fu_isRemoved, fu_cr_id) VALUES (?, ?, ?, ?, ?, ?, 0, ?)");
            if (!$stmt2) throw new Exception("Prepare failed for file insert: " . $mysqli->error);
            $fileSize = $_FILES['cr_reference_letter']['size'];
            $fileType = $_FILES['cr_reference_letter']['type'];
            $stmt2->bind_param("ssisssi", $cr_esco_id, $newName, $fileSize, $fileType, $relativePath, $file_category, $cr_id);
            if (!$stmt2->execute()) throw new Exception("Execute failed for file insert: " . $stmt2->error);
            $stmt2->close();
            error_log("[INFO] Inserted file_upload row for cr_id=$cr_id, file=$newName");
        } else {
            error_log("[ERROR] File upload failed for ESCoID: $cr_esco_id, file: $originalName");
            throw new Exception("File upload failed");
        }
    }
    $mysqli->commit();
    error_log("[INFO] Transaction committed for client_reference cr_id=$cr_id");
    echo json_encode(['status' => 'success', 'message' => $cr_id ? 'Updated!' : 'Saved!', 'cr_id' => $cr_id]);
} catch (Exception $e) {
    $mysqli->rollback();
    error_log("[ERROR] Exception: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
?>
