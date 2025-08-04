<?php
include_once("headers.php");
include_once("db_connect.php");
header("Content-Type: application/json");

error_log("[INFO] === Start Technology Classification Bulk Save/Update ===");

// 1. Log received raw input
$rawInput = file_get_contents('php://input');
error_log("[INFO] Raw input: $rawInput");

$data = json_decode($rawInput, true);

if (!$data || !is_array($data) || !isset($data[0]['esco_id'])) {
    error_log("[ERROR] Invalid payload or missing esco_id: " . json_encode($data));
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Invalid payload']);
    exit;
}

$esco_id = $data[0]['esco_id'];
error_log("[INFO] Processing technology classifications for esco_id: $esco_id");

// 2. Prepare valid IDs for later soft-deletion/versioning
$sent_ids = [];
$success_count = 0;

$mysqli->begin_transaction();

try {
    foreach ($data as $idx => $row) {
        $tc_id = $row['tc_id'] ?? null;
        $tech = $row['tc_tech_entpr_exp'] ?? '';
        $count = $row['tc_no_projs_completed'] ?? null;

        if (!$tech || $count === null) {
            error_log("[ERROR] Row $idx missing required fields: " . json_encode($row));
            continue; // skip this row but don't exit entire script
        }

        if ($tc_id) {
            // Soft-delete previous version
            $stmt = $mysqli->prepare("UPDATE technology_classification SET tc_is_deleted=1 WHERE tc_id=?");
            $stmt->bind_param("i", $tc_id);
            $stmt->execute();
            $stmt->close();
            error_log("[INFO] Soft-deleted previous tc_id=$tc_id for versioning (idx $idx)");

            // Insert new version (versioning)
            $stmt2 = $mysqli->prepare("INSERT INTO technology_classification (esco_id, tc_tech_entpr_exp, tc_no_projs_completed) VALUES (?, ?, ?)");
            $stmt2->bind_param("ssi", $esco_id, $tech, $count);
            $stmt2->execute();
            $new_tc_id = $stmt2->insert_id;
            $stmt2->close();
            error_log("[INFO] Inserted new version tc_id=$new_tc_id (prev tc_id=$tc_id)");
            $sent_ids[] = $new_tc_id;
            $success_count++;
        } else {
            // Insert new row
            $stmt = $mysqli->prepare("INSERT INTO technology_classification (esco_id, tc_tech_entpr_exp, tc_no_projs_completed) VALUES (?, ?, ?)");
            $stmt->bind_param("ssi", $esco_id, $tech, $count);
            $stmt->execute();
            $new_tc_id = $stmt->insert_id;
            $stmt->close();
            error_log("[INFO] Inserted new technology ($tech) for esco_id $esco_id, new tc_id $new_tc_id");
            $sent_ids[] = $new_tc_id;
            $success_count++;
        }
    }

    // Soft-delete any for this esco_id not in sent_ids
    if (count($sent_ids) > 0) {
        $placeholders = implode(',', array_fill(0, count($sent_ids), '?'));
        $params = array_merge([$esco_id], $sent_ids);
        $typeStr = 's' . str_repeat('i', count($sent_ids)); // first param is string
        $stmt = $mysqli->prepare("UPDATE technology_classification SET tc_is_deleted=1 WHERE esco_id=? AND tc_id NOT IN ($placeholders)");
        if ($stmt) {
            $stmt->bind_param($typeStr, ...$params);
            $stmt->execute();
            $stmt->close();
            error_log("[INFO] Soft-deleted tech for esco_id $esco_id, except tc_ids: " . implode(',', $sent_ids));
        } else {
            error_log("[ERROR] Prepare failed for soft-delete: " . $mysqli->error);
        }
    }

    $mysqli->commit();
    error_log("[INFO] === Technology Classification Save/Update Complete: $success_count successful ===");
    echo json_encode(['status' => 'success', 'message' => "$success_count items saved/updated"]);
} catch (Exception $e) {
    $mysqli->rollback();
    error_log("[ERROR] " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
?>
