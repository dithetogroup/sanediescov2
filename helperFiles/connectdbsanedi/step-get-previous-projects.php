<?php

include_once("headers.php");
include_once("db_connect.php");

header("Content-Type: application/json");

error_log("[INFO] === Start Get Previous Projects ===");

$esco_id = $_GET['esco_id'] ?? '';
if (!$esco_id) {
    error_log("[ERROR] Missing esco_id in GET: " . json_encode($_GET));
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Missing esco_id']);
    exit;
}

error_log("[INFO] Fetching projects for ESCoID: $esco_id");

$stmt = $mysqli->prepare(
    "SELECT * FROM previous_projects WHERE pp_esco_id = ? AND pp_isDeleted = 0 ORDER BY pp_proj_start_date DESC"
);
if (!$stmt) {
    error_log("[ERROR] Prepare failed for previous_projects: " . $mysqli->error);
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Query prepare failed']);
    exit;
}
$stmt->bind_param("s", $esco_id);

if (!$stmt->execute()) {
    error_log("[ERROR] Execute failed for previous_projects: " . $stmt->error);
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Query execute failed']);
    exit;
}

$result = $stmt->get_result();
$projects = [];
$project_count = 0;

while ($row = $result->fetch_assoc()) {
    $pp_id = $row['pp_id'];
    error_log("[INFO] Processing project: $pp_id");

    // Get latest not-removed file for this project (linked by fu_pp_id)
    $fileStmt = $mysqli->prepare(
        "SELECT * FROM files_upload 
         WHERE fu_pp_id = ? AND (fu_isRemoved IS NULL OR fu_isRemoved = 0)
         ORDER BY uploaded_at DESC LIMIT 1"
    );
    if (!$fileStmt) {
        error_log("[ERROR] Prepare failed for files_upload: " . $mysqli->error);
        continue; // Move to next project
    }
    $fileStmt->bind_param("i", $pp_id);
    if (!$fileStmt->execute()) {
        error_log("[ERROR] Execute failed for files_upload, pp_id=$pp_id: " . $fileStmt->error);
        $fileStmt->close();
        continue; // Move to next project
    }
    $fileResult = $fileStmt->get_result();
    $fileRow = $fileResult->fetch_assoc();
    if ($fileRow) {
        error_log("[INFO] Found file for project $pp_id: " . $fileRow['fu_name']);
        $row['reference_letter'] = $fileRow;
    } else {
        error_log("[INFO] No reference letter found for project $pp_id");
    }
    $fileStmt->close();

    $projects[] = $row;
    $project_count++;
}
$stmt->close();

error_log("[INFO] Projects fetched: $project_count for ESCoID: $esco_id");
echo json_encode(['status' => 'success', 'projects' => $projects]);

?>
