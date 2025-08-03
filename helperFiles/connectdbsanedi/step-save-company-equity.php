<?php
include_once("headers.php");
include_once("db_connect.php");
header("Content-Type: application/json");

// Logging
error_log("[INFO] === Start Company Equity Save/Update ===");

// 3. Log received post keys
error_log("[INFO] Received POST keys: " . json_encode(array_keys($_POST)));
error_log("[INFO] Received FILES: " . json_encode(array_keys($_FILES)));



$ce_esco_id = $_POST['esco_id'] ?? '';
$ce_id = $_POST['ce_id'] ?? null; // For update/version
$ce_woman_owned = $_POST['ce_woman_owned'] ?? '';
$ce_black_owned = $_POST['ce_black_owned'] ?? '';
$ce_youth_owned = $_POST['ce_youth_owned'] ?? '';
$hasFile = isset($_FILES['ce_bee_equity_cert']) && $_FILES['ce_bee_equity_cert']['error'] === UPLOAD_ERR_OK;
$file_category = 'BEE Certificate';

if (!$ce_esco_id || !$ce_woman_owned || !$ce_black_owned || !$ce_youth_owned) {
    error_log("[ERROR] Missing required fields");
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Missing required fields']);
    exit;
}

$mysqli->begin_transaction();

try {
    // If ce_id provided, soft delete the previous row (versioning)
    if ($ce_id) {
        $stmt = $mysqli->prepare("UPDATE company_equity SET ce_isDeleted=1 WHERE ce_id=?");
        $stmt->bind_param("i", $ce_id);
        $stmt->execute();
        $stmt->close();
        error_log("[INFO] Soft-deleted company_equity ce_id=$ce_id");
    }

    // Insert the new version (always)
    $stmt = $mysqli->prepare("INSERT INTO company_equity (ce_esco_id, ce_woman_owned, ce_black_owned, ce_youth_owned) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("ssss", $ce_esco_id, $ce_woman_owned, $ce_black_owned, $ce_youth_owned);
    $stmt->execute();
    $new_ce_id = $stmt->insert_id;
    $stmt->close();
    error_log("[INFO] Inserted new company_equity ce_id=$new_ce_id");

    // Handle BEE file (if present)
    // ...after company_equity insert...
    if ($hasFile) {
        error_log("[INFO] File upload detected for ce_id=$new_ce_id");
        $uploadDir = __DIR__ . "/uploads/";
        if (!file_exists($uploadDir)) {
            if (!mkdir($uploadDir, 0777, true)) {
                error_log("[ERROR] Failed to create upload directory: $uploadDir");
                throw new Exception("Failed to create upload directory: $uploadDir");
            }
        }
        $originalName = basename($_FILES['ce_bee_equity_cert']['name']);
        $ext = pathinfo($originalName, PATHINFO_EXTENSION);
        $newName = $ce_esco_id . '_BEE_' . date('ymdHis') . '.' . $ext;
        $filePath = $uploadDir . $newName;
        $relativePath = "uploads/" . $newName;

        error_log("[INFO] Moving uploaded file to $filePath");
        if (move_uploaded_file($_FILES['ce_bee_equity_cert']['tmp_name'], $filePath)) {
            $fileSize = $_FILES['ce_bee_equity_cert']['size'];
            $fileType = $_FILES['ce_bee_equity_cert']['type'];
            error_log("[INFO] File moved successfully, inserting files_upload row...");

            // Log what you're about to insert
            error_log("[INFO] Inserting into files_upload: esco_id=$ce_esco_id, name=$newName, size=$fileSize, type=$fileType, path=$relativePath, category=$file_category, ce_id=$new_ce_id");
            
            $stmt2 = $mysqli->prepare("INSERT INTO files_upload (fu_esco_id, fu_name, fu_size, fu_type, fu_path, fu_category, fu_isRemoved, fu_ce_id) VALUES (?, ?, ?, ?, ?, ?, 0, ?)");
            if (!$stmt2) {
                error_log("[ERROR] Prepare failed for file insert: " . $mysqli->error);
                throw new Exception("Prepare failed for file insert: " . $mysqli->error);
            }
            $stmt2->bind_param("ssisssi", $ce_esco_id, $newName, $fileSize, $fileType, $relativePath, $file_category, $new_ce_id);
            if (!$stmt2->execute()) {
                error_log("[ERROR] File insert failed: " . $stmt2->error);
                throw new Exception("File insert failed: " . $stmt2->error);
            }
            $stmt2->close();
            error_log("[INFO] Uploaded new BEE certificate for ce_id=$new_ce_id");
        } else {
            error_log("[ERROR] File move failed for: $filePath");
        }
    } else {
        error_log("[INFO] No file uploaded for this request.");
    }


    $mysqli->commit();
    echo json_encode(['status' => 'success', 'ce_id' => $new_ce_id, 'message' => 'Company Equity saved/updated']);
} catch (Exception $e) {
    $mysqli->rollback();
    error_log("[ERROR] " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
?>
