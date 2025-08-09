<?php
include_once("headers.php");
include_once("db_connect.php");
include_once("config.php");

require_once __DIR__ . '/vendor/autoload.php';

use \Firebase\JWT\JWT;

header("Content-Type: application/json");

// ✅ Start session & ensure secure settings
session_set_cookie_params([
    'SameSite' => 'None',
    'Secure'   => true
]);
session_start();

// ✅ Debug: Check received cookies
error_log("[INFO] Cookies Received: " . json_encode($_COOKIE));

// ✅ Retrieve JSON data
$postdata = file_get_contents("php://input");
$request = json_decode($postdata);
error_log("[INFO] Received Data: " . json_encode($request));

// ✅ Validate Required Fields
if (!isset($request->lu_email) || !isset($request->lu_password)) {
    error_log("[ERROR] Missing required fields: Email or Password");
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Email and password are required"]);
    exit();
}

$lu_email = trim($request->lu_email);
$lu_password = trim($request->lu_password);

// ✅ Validate email format
if (!filter_var($lu_email, FILTER_VALIDATE_EMAIL)) {
    error_log("[ERROR] Invalid email format: $lu_email");
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Invalid email format"]);
    exit();
}

// ✅ Query to get user data
$sql = "
SELECT 
    login_user.lu_user_id,
    login_user.lu_password,
    login_user.lu_role,
    login_user.lu_isActive,
    login_user.lu_esco_id,
    login_user.lu_title,
    login_user.lu_name,
    login_user.lu_surname,
    login_user.lu_email,
    registered_user.ru_companyName,
    registered_user.ru_companyType
FROM login_user
INNER JOIN registered_user 
    ON login_user.lu_esco_id = registered_user.ru_esco_id
WHERE login_user.lu_email = ?
";

$stmt = $mysqli->prepare($sql);
$stmt->bind_param("s", $lu_email);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows > 0) {
    $stmt->bind_result(
        $lu_user_id,
        $hashed_password,
        $lu_role,
        $lu_isActive,
        $lu_esco_id,
        $lu_title,
        $lu_name,
        $lu_surname,
        $lu_email,
        $ru_companyName,
        $ru_companyType
    );
    $stmt->fetch();

    if (password_verify($lu_password, $hashed_password)) {
        if ($lu_isActive == 1) {
            
            // ✅ Generate JWT
            $issued_at = time();
            $expiration_time = $issued_at + 3600; // 1 hour
            $payload = [
                "lu_user_id" => $lu_user_id,
                "lu_esco_id" => $lu_esco_id,
                "lu_role"    => $lu_role,
                "lu_email"   => $lu_email,
                "iat"        => $issued_at,
                "exp"        => $expiration_time
            ];
            $jwt = JWT::encode($payload, JWT_SECRET_KEY, 'HS256');

            // ✅ Prepare cookie options
            $cookieOpts = [
                "expires"  => $expiration_time,
                "path"     => "/",
                "secure"   => true,
                "httponly" => true,
                "samesite" => "None"
            ];
            if (!in_array($_SERVER['HTTP_HOST'], ['localhost', '127.0.0.1'])) {
                $cookieOpts['domain'] = '.sanediesco.org.za'; // 🔹 For live site
            }

            // ✅ Set cookie
            setcookie("auth_token", $jwt, $cookieOpts);

            // ✅ Update last login time (fixed $hu_id → $lu_user_id)
            $update_sql = "UPDATE login_user SET lu_lastLogin = NOW() WHERE lu_user_id = ?";
            $update_stmt = $mysqli->prepare($update_sql);
            $update_stmt->bind_param("i", $lu_user_id);
            $update_stmt->execute();
            $update_stmt->close();

            // ✅ Log success
            error_log("[SUCCESS] Login successful - lu_user_id: $lu_user_id, Email: $lu_email");

            // ✅ Build response
            $response = [
                "status"  => "success",
                "message" => "Login successful",
                "user"    => [
                    "id"          => $lu_user_id,
                    "email"       => $lu_email,
                    "role"        => $lu_role,
                    "escoid"      => $lu_esco_id,
                    "title"       => $lu_title,
                    "firstName"   => $lu_name,
                    "lastName"    => $lu_surname,
                    "companyType" => $ru_companyType,
                    "companyName" => $ru_companyName
                ]
            ];

            // 🔹 In dev, return the token for testing
            if (in_array($_SERVER['HTTP_HOST'], ['localhost', '127.0.0.1'])) {
                $response['debug_jwt'] = $jwt;
            }

            echo json_encode($response);

        } else {
            error_log("[ERROR] Login attempt for inactive user - lu_user_id: $lu_user_id");
            http_response_code(403);
            echo json_encode(["status" => "error", "message" => "Sorry, your account is suspended"]);
        }
    } else {
        error_log("[ERROR] Invalid password attempt - Email: $lu_email");
        echo json_encode(["status" => "error", "message" => "Invalid credentials"]);
    }
} else {
    error_log("[ERROR] Login failed - User not found for Email: $lu_email");
    echo json_encode(["status" => "error", "message" => "User not found"]);
}

$stmt->close();
$mysqli->close();
