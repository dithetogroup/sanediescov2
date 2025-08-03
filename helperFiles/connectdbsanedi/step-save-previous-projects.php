<?php
include_once("headers.php");
include_once("db_connect.php");

header("Content-Type: application/json");

// 1. Logging start of script
error_log("[INFO] === Start Previous Project Save ===");

// 2. Collect ESCo ID and file info
$pp_esco_id = $_POST['esco_id'] ?? '';
$hasFile = isset($_FILES['pp_reference_letter']) && $_FILES['pp_reference_letter']['error'] === UPLOAD_ERR_OK;
$file_category = $_POST['file_category'] ?? 'Reference Letter';

// 3. Log received post keys
error_log("[INFO] Received POST keys: " . json_encode(array_keys($_POST)));
error_log("[INFO] Received FILES: " . json_encode(array_keys($_FILES)));

if (!$pp_esco_id) {
    error_log("[ERROR] Missing esco_id");
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Missing esco_id']);
    exit;
}

$project = [
    'pp_client_name' => $_POST['pp_client_name'] ?? '',
    'pp_contact_person' => $_POST['pp_contact_person'] ?? '',
    'pp_client_contact_no' => $_POST['pp_client_contact_no'] ?? '',
    'pp_proj_desc' => $_POST['pp_proj_desc'] ?? '',
    'pp_contact_email' => $_POST['pp_contact_email'] ?? '',
    'pp_proj_value' => $_POST['pp_proj_value'] ?? '',
    'pp_savingkilowatz' => $_POST['pp_savingkilowatz'] ?? '',
    'pp_proj_start_date' => $_POST['pp_proj_start_date'] ?? '',
    'pp_proj_end_date' => $_POST['pp_proj_end_date'] ?? ''
];

$mysqli->begin_transaction();
try {
    error_log("[INFO] Preparing to insert previous project for $pp_esco_id");
    $stmt = $mysqli->prepare(
        "INSERT INTO previous_projects 
        (pp_esco_id, pp_client_name, pp_contact_person, pp_client_contact_no, pp_proj_desc, pp_contact_email, pp_proj_value, pp_savingkilowatz, pp_proj_start_date, pp_proj_end_date)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
    );
    if (!$stmt) {
        error_log("[ERROR] Prepare failed for previous_projects: " . $mysqli->error);
        throw new Exception("Prepare failed for previous_projects: " . $mysqli->error);
    }
    $stmt->bind_param(
        "ssssssssss",
        $pp_esco_id,
        $project['pp_client_name'],
        $project['pp_contact_person'],
        $project['pp_client_contact_no'],
        $project['pp_proj_desc'],
        $project['pp_contact_email'],
        $project['pp_proj_value'],
        $project['pp_savingkilowatz'],
        $project['pp_proj_start_date'],
        $project['pp_proj_end_date']
    );
    if (!$stmt->execute()) {
        error_log("[ERROR] Execute failed for previous_projects: " . $stmt->error);
        throw new Exception("Execution failed for previous_projects: " . $stmt->error);
    }
    $pp_id = $stmt->insert_id;
    $stmt->close();

    error_log("[INFO] Previous Project inserted for ESCoID: {$pp_esco_id}, ProjectID: {$pp_id}");

    // Handle file upload (if any)
    if ($hasFile) {
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
        $dateStr = date('ymdHis'); // yymmddhhmmss
        $newName = $pp_esco_id . '_' . $file_category . '_'. $filenameNoExt . '_' . $dateStr . '.' . $ext;
        $filePath = $uploadDir . $newName;
        $relativePath = "uploads/" . $newName;

        error_log("[INFO] Attempting file move to $filePath");

        if (move_uploaded_file($_FILES['pp_reference_letter']['tmp_name'], $filePath)) {
            $stmt2 = $mysqli->prepare(
                "INSERT INTO files_upload (
                    fu_esco_id, fu_name, fu_size, fu_type, fu_path, fu_category, fu_isRemoved, fu_pp_id
                ) VALUES (?, ?, ?, ?, ?, ?, 0, ?)"
            );
            if (!$stmt2) {
                error_log("[ERROR] Prepare failed for files_upload: " . $mysqli->error);
                throw new Exception("Prepare failed for files_upload: " . $mysqli->error);
            }
            $fileSize = $_FILES['pp_reference_letter']['size'];
            $fileType = $_FILES['pp_reference_letter']['type'];
            $stmt2->bind_param(
                "ssssssi",
                $pp_esco_id,
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
            error_log("[INFO] File uploaded and saved for ESCoID: {$pp_esco_id} - File: $originalName");
        } else {
            error_log("[ERROR] move_uploaded_file failed for ESCoID: {$pp_esco_id}");
            throw new Exception("File upload failed");
        }
    }

    $mysqli->commit();
    error_log("[INFO] Transaction committed for ESCoID: {$pp_esco_id}");
    echo json_encode(['status' => 'success', 'message' => 'Project saved!']);
} catch (Exception $e) {
    $mysqli->rollback();
    error_log("[ERROR] Exception for ESCoID: {$pp_esco_id} - " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
?>
