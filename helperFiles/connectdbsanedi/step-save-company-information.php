<?php

/*
If data has not changed:
If a new file is uploaded:
Soft-delete previous file(s) (linked to current ci_id)
Insert the new file, link it to the existing latest ci_id
Do NOT insert a new company_information row
If no new file is uploaded:
Do nothing, return success, no change
If data has changed:
Soft-delete current company_information row
Insert a new row with new data
If a new file is uploaded:
Soft-delete previous file(s) (linked to old ci_id)
Insert new file, link to new ci_id
If no new file is uploaded:
Re-link the previous (not-removed) file to new ci_id if it exists
*/


include_once("headers.php");
include_once("db_connect.php");

header("Content-Type: application/json");
error_log("[INFO] === Start Company Information Save ===");

$ci_esco_id = $_POST['esco_id'] ?? '';
$ci_energy_man_exp = $_POST['ci_energy_man_exp'] ?? '';
$ci_com_exp_of_tech_pro = $_POST['ci_com_exp_of_tech_pro'] ?? '';
$ci_business_activities_provinces = $_POST['ci_business_activities_provinces'] ?? '';
$file_category = $_POST['file_category'] ?? 'CICP';
$hasFile = isset($_FILES['ci_cicp_file']) && $_FILES['ci_cicp_file']['error'] === UPLOAD_ERR_OK;

// Province string handling
if (is_string($ci_business_activities_provinces) && preg_match('/^\s*\[.*\]\s*$/', $ci_business_activities_provinces)) {
    $tmp = json_decode($ci_business_activities_provinces, true);
    if (is_array($tmp)) $ci_business_activities_provinces = implode(',', $tmp);
}
if (is_array($ci_business_activities_provinces)) {
    $ci_business_activities_provinces = implode(',', $ci_business_activities_provinces);
}

error_log("[INFO] Received POST for ESCoID: {$ci_esco_id} | Fields: " . json_encode(array_keys($_POST)));

if (!$ci_esco_id || !$ci_energy_man_exp || !$ci_com_exp_of_tech_pro || !$ci_business_activities_provinces) {
    $msg = "Missing required fields: esco_id=$ci_esco_id, ci_energy_man_exp=$ci_energy_man_exp, ci_com_exp_of_tech_pro=$ci_com_exp_of_tech_pro";
    error_log("[ERROR] $msg");
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => $msg]);
    exit;
}

$mysqli->begin_transaction();

try {
    // 1. Get the latest non-deleted company info row for this esco
    $stmt = $mysqli->prepare("SELECT * FROM company_information WHERE ci_esco_id = ? AND ci_isDeleted = 0 ORDER BY ci_updated_date DESC LIMIT 1");
    $stmt->bind_param("s", $ci_esco_id);
    $stmt->execute();
    $latest = $stmt->get_result()->fetch_assoc();
    $stmt->close();

    $dataUnchanged = false;
    if ($latest &&
        $latest['ci_energy_man_exp'] === $ci_energy_man_exp &&
        $latest['ci_com_exp_of_tech_pro'] === $ci_com_exp_of_tech_pro &&
        $latest['ci_business_activities_provinces'] === $ci_business_activities_provinces
    ) {
        $dataUnchanged = true;
        error_log("[INFO] Company info data unchanged for ESCoID: $ci_esco_id");
    }

    if ($dataUnchanged && !$hasFile) {
        error_log("[INFO] No changes in company info, no new file uploaded. Nothing to do.");
        $mysqli->rollback();
        echo json_encode(['status' => 'success', 'message' => 'No changes detected.']);
        exit;
    }

    // === ONLY FILE UPLOADED ===
    if ($dataUnchanged && $hasFile) {
        error_log("[INFO] Only file updated for ESCoID: $ci_esco_id, will upload and link file to latest ci_id: " . $latest['ci_id']);

        // Soft-delete previous files for this ci_id
        $stmt = $mysqli->prepare("UPDATE files_upload SET fu_isRemoved = 1 WHERE fu_ci_id = ? AND fu_isRemoved = 0");
        $stmt->bind_param("i", $latest['ci_id']);
        $stmt->execute();
        $stmt->close();
        error_log("[INFO] Soft-deleted previous file(s) for ci_id: " . $latest['ci_id']);

        // Upload new file and link to latest ci_id
        $uploadDir = __DIR__ . "/uploads/";
        if (!file_exists($uploadDir)) {
            if (!mkdir($uploadDir, 0777, true)) {
                throw new Exception("Failed to create upload directory: $uploadDir");
            }
        }
        date_default_timezone_set('Africa/Johannesburg');
        $originalName = basename($_FILES['ci_cicp_file']['name']);
        $ext = pathinfo($originalName, PATHINFO_EXTENSION);
        $filenameNoExt = preg_replace('/\s+/', '-', pathinfo($originalName, PATHINFO_FILENAME));
        $filenameNoExt = preg_replace('/[^A-Za-z0-9_\-]/', '_', $filenameNoExt);
        $clean_esco_id = preg_replace('/[^A-Za-z0-9_\-]/', '_', $ci_esco_id);
        $timestamp = date('ymdHis');
        $newName = $clean_esco_id . '_' . $file_category . '_' . $filenameNoExt . '_' . $timestamp . '.' . $ext;
        $filePath = $uploadDir . $newName;
        $relativePath = "uploads/" . $newName;
        $fileSize = $_FILES['ci_cicp_file']['size'];
        $fileType = $_FILES['ci_cicp_file']['type'];
        $fu_isRemoved = 0;

        error_log("[INFO] Moving uploaded file to: $filePath");
        if (move_uploaded_file($_FILES['ci_cicp_file']['tmp_name'], $filePath)) {
            error_log("[INFO] File move successful: $filePath");
            $stmt2 = $mysqli->prepare("INSERT INTO files_upload 
                (fu_esco_id, fu_name, fu_size, fu_type, fu_path, fu_category, fu_isRemoved, fu_ci_id) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
            $stmt2->bind_param(
                "ssisssii", 
                $ci_esco_id, 
                $newName, 
                $fileSize, 
                $fileType, 
                $relativePath, 
                $file_category, 
                $fu_isRemoved,
                $latest['ci_id']
            );
            if (!$stmt2->execute()) {
                throw new Exception("Execution failed for files_upload: " . $stmt2->error);
            }
            $stmt2->close();
            error_log("[INFO] File uploaded and linked to existing company_information (ci_id: {$latest['ci_id']})");
        } else {
            error_log("[ERROR] File upload failed for ESCoID: $ci_esco_id - " . $_FILES['ci_cicp_file']['error']);
            throw new Exception("File upload failed");
        }

        $mysqli->commit();
        error_log("[INFO] Transaction committed for ESCoID: $ci_esco_id (file upload only)");
        echo json_encode(['status' => 'success', 'message' => 'File uploaded and linked to company information.']);
        exit;
    }

    // === DATA HAS CHANGED (new row must be inserted) ===

    // Soft-delete previous company info row if exists
    if ($latest) {
        $stmt = $mysqli->prepare("UPDATE company_information SET ci_isDeleted = 1 WHERE ci_id = ?");
        $stmt->bind_param("i", $latest['ci_id']);
        $stmt->execute();
        $stmt->close();
        error_log("[INFO] Marked previous company_information as deleted (ci_id: {$latest['ci_id']})");
    }

    // Insert new company info row
    $stmt = $mysqli->prepare("INSERT INTO company_information 
        (ci_esco_id, ci_energy_man_exp, ci_com_exp_of_tech_pro, ci_business_activities_provinces) 
        VALUES (?, ?, ?, ?)");
    $stmt->bind_param("ssss", $ci_esco_id, $ci_energy_man_exp, $ci_com_exp_of_tech_pro, $ci_business_activities_provinces);
    if (!$stmt->execute()) {
        throw new Exception("Execution failed for company_information: " . $stmt->error);
    }
    $new_ci_id = $stmt->insert_id;
    $stmt->close();
    error_log("[INFO] Inserted company_information row for ESCoID: $ci_esco_id | ci_id: $new_ci_id");

    if ($hasFile) {
        // Soft-delete previous files for old ci_id
        if ($latest) {
            $stmt = $mysqli->prepare("UPDATE files_upload SET fu_isRemoved = 1 WHERE fu_ci_id = ? AND fu_isRemoved = 0");
            $stmt->bind_param("i", $latest['ci_id']);
            $stmt->execute();
            $stmt->close();
            error_log("[INFO] Soft-deleted previous file(s) for ci_id: {$latest['ci_id']}");
        }

        $uploadDir = __DIR__ . "/uploads/";
        if (!file_exists($uploadDir)) {
            if (!mkdir($uploadDir, 0777, true)) {
                throw new Exception("Failed to create upload directory: $uploadDir");
            }
        }
        date_default_timezone_set('Africa/Johannesburg');
        $originalName = basename($_FILES['ci_cicp_file']['name']);
        $ext = pathinfo($originalName, PATHINFO_EXTENSION);
        $filenameNoExt = preg_replace('/\s+/', '-', pathinfo($originalName, PATHINFO_FILENAME));
        $filenameNoExt = preg_replace('/[^A-Za-z0-9_\-]/', '_', $filenameNoExt);
        $clean_esco_id = preg_replace('/[^A-Za-z0-9_\-]/', '_', $ci_esco_id);
        $timestamp = date('ymdHis');
        $newName = $clean_esco_id . '_' . $file_category . '_' . $filenameNoExt . '_' . $timestamp . '.' . $ext;
        $filePath = $uploadDir . $newName;
        $relativePath = "uploads/" . $newName;
        $fileSize = $_FILES['ci_cicp_file']['size'];
        $fileType = $_FILES['ci_cicp_file']['type'];
        $fu_isRemoved = 0;

        error_log("[INFO] Moving uploaded file to: $filePath");
        if (move_uploaded_file($_FILES['ci_cicp_file']['tmp_name'], $filePath)) {
            error_log("[INFO] File move successful: $filePath");
            $stmt2 = $mysqli->prepare("INSERT INTO files_upload 
                (fu_esco_id, fu_name, fu_size, fu_type, fu_path, fu_category, fu_isRemoved, fu_ci_id) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
            $stmt2->bind_param(
                "ssisssii", 
                $ci_esco_id, 
                $newName, 
                $fileSize, 
                $fileType, 
                $relativePath, 
                $file_category, 
                $fu_isRemoved,
                $new_ci_id
            );
            if (!$stmt2->execute()) {
                throw new Exception("Execution failed for files_upload: " . $stmt2->error);
            }
            $stmt2->close();
            error_log("[INFO] File uploaded and linked to new company_information (ci_id: $new_ci_id)");
        } else {
            error_log("[ERROR] File upload failed for ESCoID: $ci_esco_id - " . $_FILES['ci_cicp_file']['error']);
            throw new Exception("File upload failed");
        }
    } else {
        // No file uploaded: re-link old file (if exists and not removed) to new ci_id
        if ($latest) {
            $stmt = $mysqli->prepare("SELECT fu_id FROM files_upload WHERE fu_ci_id = ? AND fu_isRemoved = 0 ORDER BY uploaded_at DESC LIMIT 1");
            $stmt->bind_param("i", $latest['ci_id']);
            $stmt->execute();
            $stmt->bind_result($fu_id);
            if ($stmt->fetch()) {
                $stmt->close();
                $stmt = $mysqli->prepare("UPDATE files_upload SET fu_ci_id = ? WHERE fu_id = ?");
                $stmt->bind_param("ii", $new_ci_id, $fu_id);
                if (!$stmt->execute()) {
                    throw new Exception("Failed to re-link file_upload to new ci_id: " . $stmt->error);
                }
                error_log("[INFO] Re-linked file_upload (fu_id: $fu_id) to new company_information (ci_id: $new_ci_id)");
                $stmt->close();
            } else {
                $stmt->close();
                error_log("[INFO] No previous file to re-link for ci_id: {$latest['ci_id']}");
            }
        }
    }

    $mysqli->commit();
    error_log("[INFO] Transaction committed for ESCoID: $ci_esco_id");
    echo json_encode(['status' => 'success', 'message' => 'Data saved successfully']);

} catch (Exception $e) {
    $mysqli->rollback();
    $errMsg = "[ERROR] Exception for ESCoID: $ci_esco_id - " . $e->getMessage();
    error_log($errMsg);
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
?>
