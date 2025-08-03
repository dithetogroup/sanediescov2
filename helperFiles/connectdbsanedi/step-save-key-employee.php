<?php
include_once("headers.php");
include_once("db_connect.php");
header("Content-Type: application/json");

error_log("[INFO] === Start Key Employee Save/Update ===");

// 1. Collect data
$ke_esco_id = $_POST['esco_id'] ?? '';
$ke_id = $_POST['ke_id'] ?? null; // for versioning
$fields = [
    'ke_full_names', 'ke_id_no', 'ke_no_yrs_firm', 'ke_highest_education',
    'ke_add_traing_certs', 'ke_no_of_yrs_energy', 'ke_id_type',
    'ke_epc_professional_registered', 'ke_is_new_job'
];
$data = [];
foreach ($fields as $f) $data[$f] = $_POST[$f] ?? '';

if (!$ke_esco_id || !$data['ke_full_names']) {
    error_log("[ERROR] Missing required fields");
    http_response_code(400);
    echo json_encode(['status'=>'error', 'message'=>'Missing required fields']);
    exit;
}

$mysqli->begin_transaction();
try {
    // If ke_id present, soft delete the old version
    if ($ke_id) {
        $stmt = $mysqli->prepare("UPDATE key_employee SET ke_isDeleted=1 WHERE ke_id=?");
        $stmt->bind_param("i", $ke_id);
        $stmt->execute();
        $stmt->close();
        error_log("[INFO] Soft-deleted key_employee ke_id=$ke_id");
    }

    // Insert new version
    $stmt = $mysqli->prepare(
        "INSERT INTO key_employee (ke_esco_id, ke_full_names, ke_id_no, ke_no_yrs_firm, ke_highest_education, ke_add_traing_certs, ke_no_of_yrs_energy, ke_id_type, ke_epc_professional_registered, ke_is_new_job) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
    );
    $stmt->bind_param(
        "ssssssssss",
        $ke_esco_id, $data['ke_full_names'], $data['ke_id_no'], $data['ke_no_yrs_firm'], $data['ke_highest_education'],
        $data['ke_add_traing_certs'], $data['ke_no_of_yrs_energy'], $data['ke_id_type'], $data['ke_epc_professional_registered'], $data['ke_is_new_job']
    );
    $stmt->execute();
    $new_ke_id = $stmt->insert_id;
    $stmt->close();
    error_log("[INFO] Inserted key_employee row ke_id=$new_ke_id");

    // Process files (CV, certifications, EPC)
    $fileFields = [
        ['key'=>'ke_emp_cv',      'category'=>'Employee CV',     'type'=>'cv'],
        ['key'=>'ke_certification', 'category'=>'Certification',   'type'=>'certification'],
        ['key'=>'ke_epc_professional_letter', 'category'=>'EPC Professional Letter', 'type'=>'epc_letter']
    ];
    foreach ($fileFields as $ff) {
        // Support multiple certifications
        if ($ff['type'] == 'certification' && isset($_FILES[$ff['key']])) {
            $certFiles = $_FILES[$ff['key']];
            if (is_array($certFiles['name'])) {
                for ($i = 0; $i < count($certFiles['name']); $i++) {
                    if ($certFiles['error'][$i] === UPLOAD_ERR_OK) {
                        save_employee_file($mysqli, $ke_esco_id, $new_ke_id, [
                            'name' => $certFiles['name'][$i],
                            'tmp_name' => $certFiles['tmp_name'][$i],
                            'size' => $certFiles['size'][$i],
                            'type' => $certFiles['type'][$i]
                        ], $ff['category'], $ff['type']);
                    }
                }
                continue;
            }
        }
        // Single file
        if (isset($_FILES[$ff['key']]) && $_FILES[$ff['key']]['error'] === UPLOAD_ERR_OK) {
            save_employee_file($mysqli, $ke_esco_id, $new_ke_id, $_FILES[$ff['key']], $ff['category'], $ff['type']);
        }
    }

    $mysqli->commit();
    echo json_encode(['status'=>'success','ke_id'=>$new_ke_id,'message'=>'Key Employee saved']);
} catch (Exception $e) {
    $mysqli->rollback();
    error_log("[ERROR] Exception: ".$e->getMessage());
    http_response_code(500);
    echo json_encode(['status'=>'error','message'=>$e->getMessage()]);
}

function save_employee_file($mysqli, $esco_id, $ke_id, $fileArr, $category, $type) {
    $uploadDir = __DIR__ . "/uploads/";
    if (!file_exists($uploadDir)) mkdir($uploadDir, 0777, true);
    $ext = pathinfo($fileArr['name'], PATHINFO_EXTENSION);
    $newName = $esco_id . "_KE_" . $type . "_" . date('ymdHis') . "." . $ext;
    $filePath = $uploadDir . $newName;
    $relativePath = "uploads/" . $newName;

    if (move_uploaded_file($fileArr['tmp_name'], $filePath)) {
        error_log("[INFO] File uploaded for $type: $filePath");
        $stmt = $mysqli->prepare("INSERT INTO files_upload (fu_esco_id, fu_ke_id, fu_type, fu_name, fu_size, fu_path, fu_category, fu_isRemoved) VALUES (?, ?, ?, ?, ?, ?, ?, 0)");
        $stmt->bind_param("sississ", $esco_id, $ke_id, $type, $newName, $fileArr['size'], $relativePath, $category);
        $stmt->execute();
        $stmt->close();
    } else {
        error_log("[ERROR] Failed to upload $type file: $filePath");
    }
}
?>
