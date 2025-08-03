<?php
// Include necessary files
include_once("headers.php");
include_once("db_connect.php");
include_once("config.php");

require_once __DIR__ . '/vendor/autoload.php';  // Correct autoload inclusion

use \Firebase\JWT\JWT; // Include JWT library

header("Content-Type: application/json");

// ✅ Start session & ensure SameSite/secure settings
session_set_cookie_params(['SameSite' => 'None', 'Secure' => true]);
session_start();

// ✅ Debugging: Check received cookies
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

// ✅ Prepare the SQL query to find the user, personal information, and plan details

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
    login_user.lu_email, registered_user.ru_companyName, registered_user.ru_companyType
FROM login_user
INNER JOIN registered_user ON login_user.lu_esco_id = registered_user.ru_esco_id
WHERE login_user.lu_email = ?
";


$stmt = $mysqli->prepare($sql);
$stmt->bind_param("s", $lu_email);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows > 0) {
    // ✅ User found, now fetch the data
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

    // ✅ Check if the password matches
    if (password_verify($lu_password, $hashed_password)) {
        // ✅ Check if the user is active
        if ($lu_isActive == 1) {
            // ✅ Generate JWT token
            $issued_at = time();
            $expiration_time = $issued_at + 3600;  // Token valid for 1 hour
            $payload = array(
                "lu_user_id" => $lu_user_id,
                "lu_esco_id" => $lu_esco_id,
                "lu_role" => $lu_role,
                "lu_email" => $lu_email,
                "iat" => $issued_at,
                "exp" => $expiration_time
            );

            // ✅ Generate JWT
            $jwt = JWT::encode($payload, JWT_SECRET_KEY, 'HS256');

            // ✅ Set JWT as an HttpOnly Secure Cookie
            setcookie("auth_token", $jwt, [
                "expires" => $expiration_time,
                "path" => "/",
                //"domain" => "board.dithetogroup.co.za",  // ❌ Remove "https://"
                "domain" => ($_SERVER['HTTP_HOST'] === 'localhost' || $_SERVER['HTTP_HOST'] === '127.0.0.1') ? "" : "tier.sanediesco.org.za",
                "secure" => true,  // Secure cookie for HTTPS only
                "httponly" => true,  // Prevents JavaScript access
                "samesite" => "none"  // Prevents CSRF attacks
            ]);

            // ✅ Update last login time
            $update_sql = "UPDATE login_user SET lu_lastLogin = NOW() WHERE lu_user_id = ?";
            $update_stmt = $mysqli->prepare($update_sql);
            $update_stmt->bind_param("i", $hu_id);
            $update_stmt->execute();
            $update_stmt->close();

            // ✅ Log successful login
            error_log("[SUCCESS] Login successful - lu_user_id: $lu_user_id, Email: $lu_email");

            // ✅ Return user information
            echo json_encode(["status" => "success", "message" => "Login successful", "user" => [
                "id" => $lu_user_id,
                "email" => $lu_email,
                "role" => $lu_role,
                "escoid" => $lu_esco_id,
                "title" => $lu_title,
                "firstName" => $lu_name,
                "lastName" => $lu_surname,
                "companyType" => $ru_companyType,
                "companyName" => $ru_companyName
            ]]);
        } else {
            error_log("[ERROR] Login attempt for inactive user - lu_user_id: $lu_user_id, Email: $lu_email");
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
?>