<?php
// ✅ Exact origins (NO trailing slash)
$allowed_origins = [
  "http://localhost:4200",
  "https://tier.sanediesco.org.za",
  "https://www.tier.sanediesco.org.za"
];

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';

if (in_array($origin, $allowed_origins, true)) {
  header("Access-Control-Allow-Origin: $origin");
  header("Vary: Origin"); // helps caches/CDN
}

header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true"); // ✅ required for cookies

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(200);
  exit();
}
