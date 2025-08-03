<?php
include_once("headers.php");
include_once("db_connect.php");

header("Content-Type: application/json");

$postdata = file_get_contents("php://input");
$request = json_decode($postdata);
error_log("[INFO] Received Data: " . json_encode($request));

if (!isset($request->token)) {
    error_log("[ERROR] Missing required fields: Token");
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Token is required"]);
    exit();
}

$token = trim($request->token);

// ✅ Lookup the token and its expiry
$sql = "SELECT pr_email, pr_token_expiry FROM password_reset WHERE pr_token = ?";
$stmt = $mysqli->prepare($sql);
$stmt->bind_param("s", $token);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    $expiryTimestamp = strtotime($row['pr_token_expiry']);
    $currentTimestamp = time();

    if ($currentTimestamp > $expiryTimestamp) {
        error_log("[WARNING] Token expired for email: " . $row['pr_email']);
        echo json_encode(["status" => "error", "message" => "Token expired"]);
        exit();
    }

    // ✅ Token is valid and not expired
    echo json_encode(["status" => "success", "message" => "Valid token"]);
    exit();
} else {
    error_log("[ERROR] Token not found: " . $token);
    echo json_encode(["status" => "error", "message" => "Token not found"]);
    exit();
}

$stmt->close();
$mysqli->close();
?>
