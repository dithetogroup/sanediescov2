<?php
include_once("headers.php");
include_once("db_connect.php"); // Expects $mysqli

header("Content-Type: application/json");

$ci_esco_id = $_POST['esco_id'] ?? '';
$ci_energy_man_exp = $_POST['ci_energy_man_exp'] ?? '';
$ci_com_exp_of_tech_pro = $_POST['ci_com_exp_of_tech_pro'] ?? '';
$ci_business_activities_provinces = $_POST['ci_business_activities_provinces'] ?? '';
// If it's a JSON array string, decode to PHP array
if (is_string($ci_business_activities_provinces) && 
    preg_match('/^\s*\[.*\]\s*$/', $ci_business_activities_provinces)) {
    $tmp = json_decode($ci_business_activities_provinces, true);
    if (is_array($tmp)) {
        $ci_business_activities_provinces = implode(',', $tmp);
    }
}
// If still array (shouldn't happen, but just in case)
if (is_array($ci_business_activities_provinces)) {
    $ci_business_activities_provinces = implode(',', $ci_business_activities_provinces);
}
$file_category = $_POST['file_category'] ?? 'CICP';
$hasFile = isset($_FILES['ci_cicp_file']) && $_FILES['ci_cicp_file']['error'] === UPLOAD_ERR_OK;

// Log all received POST keys for debugging (can be removed in prod)
error_log("[INFO] Received POST for ESCoID: {$ci_esco_id} - " . json_encode(array_keys($_POST)));

if (!$ci_esco_id || !$ci_energy_man_exp || !$ci_com_exp_of_tech_pro || !$ci_business_activities_provinces) {
    $msg = "Missing required fields: esco_id=$ci_esco_id, ci_energy_man_exp=$ci_energy_man_exp, ci_com_exp_of_tech_pro=$ci_com_exp_of_tech_pro";
    error_log("[ERROR] $msg");
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => $msg]);
    exit;
}

$mysqli->begin_transaction();

try {
    // Insert or Update Company Info
    $stmt = $mysqli->prepare("INSERT INTO company_information (ci_esco_id, ci_energy_man_exp, ci_com_exp_of_tech_pro, ci_business_activities_provinces) VALUES (?, ?, ?, ?)");
    if (!$stmt) {
        throw new Exception("Prepare failed for company_information: " . $mysqli->error);
    }
    $stmt->bind_param("ssss", $ci_esco_id, $ci_energy_man_exp, $ci_com_exp_of_tech_pro, $ci_business_activities_provinces);
    if (!$stmt->execute()) {
        throw new Exception("Execution failed for company_information: " . $stmt->error);
    }
    $stmt->close();
    error_log("[INFO] Company info inserted/updated for ESCoID: {$ci_esco_id}");

    // Handle File Upload (if present)
    if ($hasFile) {
        $uploadDir = __DIR__ . "/uploads/";
        if (!file_exists($uploadDir)) {
            if (!mkdir($uploadDir, 0777, true)) {
                throw new Exception("Failed to create upload directory: $uploadDir");
            }
        }

        date_default_timezone_set('Africa/Johannesburg'); // Set to South African time zone


        $originalName = basename($_FILES['ci_cicp_file']['name']);
        $ext = pathinfo($originalName, PATHINFO_EXTENSION);
        $filenameNoExt = pathinfo($originalName, PATHINFO_FILENAME);

        // Replace spaces with hyphens, remove special chars (except - and _)
        $filenameNoExt = str_replace(' ', '-', $filenameNoExt);
        $filenameNoExt = preg_replace('/[^A-Za-z0-9_\-]/', '_', $filenameNoExt);

        // Clean up ESCo ID for filesystem
        $clean_esco_id = preg_replace('/[^A-Za-z0-9_\-]/', '_', $ci_esco_id);

        $timestamp = date('ymds'); // e.g. 25080321 for 2025-08-03, 21 seconds


        // Compose the new file name: ESCoID_filename-with-hyphens.ext
        $newName = $clean_esco_id . '_' . $file_category . '_' . $filenameNoExt . '_' . $timestamp . '.' . $ext;
        //$newName = strtolower($filenameNoExt); // <-- Auto-lowercase the full filename
        $filePath = $uploadDir . $newName;
        $relativePath = "uploads/" . $newName;
        $fileSize = $_FILES['ci_cicp_file']['size'];
        $fileType = $_FILES['ci_cicp_file']['type'];
        $fu_isRemoved = 0; // Not removed

        if (move_uploaded_file($_FILES['ci_cicp_file']['tmp_name'], $filePath)) {
            $stmt2 = $mysqli->prepare("INSERT INTO files_upload 
                (fu_esco_id, fu_name, fu_size, fu_type, fu_path, fu_category, fu_isRemoved) 
                VALUES (?, ?, ?, ?, ?, ?, ?)");
            if (!$stmt2) {
                throw new Exception("Prepare failed for files_upload: " . $mysqli->error);
            }
            $stmt2->bind_param(
                "ssisssi", 
                $ci_esco_id, 
                $newName, // Store new name with ESCoID prefix
                $fileSize, 
                $fileType, 
                $relativePath, 
                $file_category, 
                $fu_isRemoved
            );
            if (!$stmt2->execute()) {
                throw new Exception("Execution failed for files_upload: " . $stmt2->error);
            }
            $stmt2->close();
            error_log("[INFO] File uploaded for ESCoID: {$ci_esco_id} - {$newName} ({$fileSize} bytes)");
        } else {
            error_log("[ERROR] File upload failed for ESCoID: {$ci_esco_id} - " . $_FILES['ci_cicp_file']['error']);
            throw new Exception("File upload failed");
        }
    }

    $mysqli->commit();
    error_log("[INFO] Transaction committed for ESCoID: {$ci_esco_id}");
    echo json_encode(['status' => 'success', 'message' => 'Data saved successfully']);
} catch (Exception $e) {
    $mysqli->rollback();
    $errMsg = "[ERROR] Exception for ESCoID: {$ci_esco_id} - " . $e->getMessage();
    error_log($errMsg);
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
