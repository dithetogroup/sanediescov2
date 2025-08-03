<?php
include_once("headers.php");
include_once("db_connect.php");

header("Content-Type: application/json");
error_log("[INFO] === Start Previous Project Update ===");

$pp_id = $_POST['pp_id'] ?? '';
$pp_esco_id = $_POST['esco_id'] ?? '';
if (!$pp_id) {
    error_log("[ERROR] Missing pp_id in POST: " . json_encode($_POST));
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Missing pp_id']);
    exit;
}

// Gather fields
$fields = [
    'pp_client_name' => $_POST['pp_client_name'] ?? '',
    'pp_contact_person' => $_POST['pp_contact_person'] ?? '',
    'pp_client_contact_no' => $_POST['pp_client_contact_no'] ?? '',
    'pp_proj_desc' => $_POST['pp_proj_desc'] ?? '',
    'pp_contact_email' => $_POST['pp_contact_email'] ?? '',
    'pp_proj_value' => $_POST['pp_proj_value'] ?? '',
    'pp_savingkilowatz' => $_POST['pp_savingkilowatz'] ?? '',
    'pp_proj_start_date' => $_POST['pp_proj_start_date'] ?? '',
    'pp_proj_end_date' => $_POST['pp_proj_end_date'] ?? '',
];

// File upload logic
$hasFile = isset($_FILES['pp_reference_letter']) && $_FILES['pp_reference_letter']['error'] === UPLOAD_ERR_OK;
$file_category = $_POST['file_category'] ?? 'Previous Project Reference Letter';

$mysqli->begin_transaction();
try {
    // 1. Update the project record
    error_log("[INFO] Updating previous project $pp_id");

    $stmt = $mysqli->prepare(
        "UPDATE previous_projects SET
            pp_client_name = ?,
            pp_contact_person = ?,
            pp_client_contact_no = ?,
            pp_proj_desc = ?,
            pp_contact_email = ?,
            pp_proj_value = ?,
            pp_savingkilowatz = ?,
            pp_proj_start_date = ?,
            pp_proj_end_date = ?
        WHERE pp_id = ?"
    );
    if (!$stmt) {
        error_log("[ERROR] Prepare failed: " . $mysqli->error);
        throw new Exception("Prepare failed for update: " . $mysqli->error);
    }
    $stmt->bind_param(
        "sssssssssi",
        $fields['pp_client_name'],
        $fields['pp_contact_person'],
        $fields['pp_client_contact_no'],
        $fields['pp_proj_desc'],
        $fields['pp_contact_email'],
        $fields['pp_proj_value'],
        $fields['pp_savingkilowatz'],
        $fields['pp_proj_start_date'],
        $fields['pp_proj_end_date'],
        $pp_id
    );
    if (!$stmt->execute()) {
        error_log("[ERROR] Execute failed for update: " . $stmt->error);
        throw new Exception("Execute failed for update: " . $stmt->error);
    }
    $stmt->close();
    error_log("[INFO] Project $pp_id updated successfully.");

    // 2. Handle file upload (optional, only if file present)
    if ($hasFile) {
        // 2a. Soft-delete old files
        $delStmt = $mysqli->prepare("UPDATE files_upload SET fu_isRemoved = 1 WHERE fu_pp_id = ?");
        $delStmt->bind_param("i", $pp_id);
        if (!$delStmt->execute()) {
            error_log("[ERROR] Failed to soft-delete old files for project $pp_id: " . $delStmt->error);
            throw new Exception("Failed to soft-delete old files: " . $delStmt->error);
        }
        $delStmt->close();
        error_log("[INFO] Soft-deleted old files for project $pp_id");

        // 2b. Save new file
        $uploadDir = __DIR__ . "/uploads/";
        if (!file_exists($uploadDir)) {
            if (!mkdir($uploadDir, 0777, true)) {
                error_log("[ERROR] Failed to create upload directory: $uploadDir");
                throw new Exception("Failed to create upload directory: $uploadDir");
            }
        }

        date_default_timezone_set('Africa/Johannesburg');
        $originalName = basename($_FILES['pp_reference_letter']['name']);
        $ext = pathinfo($originalName, PATHINFO_EXTENSION);
        $filenameNoExt = preg_replace('/\s+/', '-', pathinfo($originalName, PATHINFO_FILENAME));
        $dateStr = date('ymdHis');
        $file_cat = "previousprojectref";

        //$newName = 'UPDATE_' . $pp_id . '_' . $file_category . '_' . $filenameNoExt . '_' . $dateStr . '.' . $ext;

        $newName = $pp_esco_id . '_' . $file_cat . '_'. $filenameNoExt . '_' . $dateStr . '.' . $ext;


        $filePath = $uploadDir . $newName;
        $relativePath = "uploads/" . $newName;

        if (move_uploaded_file($_FILES['pp_reference_letter']['tmp_name'], $filePath)) {
            $fileSize = $_FILES['pp_reference_letter']['size'];
            $fileType = $_FILES['pp_reference_letter']['type'];
            $fu_esco_id = $_POST['esco_id'] ?? '';

            $stmt2 = $mysqli->prepare(
                "INSERT INTO files_upload (
                    fu_esco_id, fu_name, fu_size, fu_type, fu_path, fu_category, fu_isRemoved, fu_pp_id
                ) VALUES (?, ?, ?, ?, ?, ?, 0, ?)"
            );
            if (!$stmt2) {
                error_log("[ERROR] Prepare failed for files_upload: " . $mysqli->error);
                throw new Exception("Prepare failed for files_upload: " . $mysqli->error);
            }
            $stmt2->bind_param(
                "ssssssi",
                $fu_esco_id,
                $newName,
                $fileSize,
                $fileType,
                $relativePath,
                $file_category,
                $pp_id
            );
            if (!$stmt2->execute()) {
                error_log("[ERROR] Execute failed for files_upload: " . $stmt2->error);
                throw new Exception("Execution failed for files_upload: " . $stmt2->error);
            }
            $stmt2->close();
            error_log("[INFO] New file uploaded and saved for project $pp_id: $originalName");
        } else {
            error_log("[ERROR] move_uploaded_file failed for project $pp_id");
            throw new Exception("File upload failed");
        }
    }

    $mysqli->commit();
    error_log("[INFO] Transaction committed for updated project $pp_id");
    echo json_encode(['status' => 'success', 'message' => 'Project updated!']);
} catch (Exception $e) {
    $mysqli->rollback();
    error_log("[ERROR] Exception: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
?>
