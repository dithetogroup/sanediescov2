<?php
// ✅ Define allowed origins (local + live environment)
$allowed_origins = [
    "http://localhost:4200",            // 🔹 Local development
    "https://tier.sanediesco.org.za/",   // 🔹 Live website (non-www)
    "https://www.tier.sanediesco.org.za/" // 🔹 Live website (www)
];

// ✅ Get the request's origin
$origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : "";

// ✅ Check if the request's origin is in the allowed list
if (in_array($origin, $allowed_origins)) {
    header("Access-Control-Allow-Origin: $origin"); // ✅ Allow dynamic origins
}

header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true"); // ✅ Required for cookies

// ✅ Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
