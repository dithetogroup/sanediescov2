<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

function line($msg) { echo $msg . PHP_EOL; }

try {
    require __DIR__ . '/vendor/autoload.php';
    line("✅ Autoload: OK");
} catch (Throwable $e) {
    line("❌ Autoload failed: " . $e->getMessage());
    exit(1);
}

/** Package versions (if Composer 2.0+ class exists) */
if (class_exists(\Composer\InstalledVersions::class)) {
    $v = fn($p) => \Composer\InstalledVersions::isInstalled($p)
        ? \Composer\InstalledVersions::getPrettyVersion($p) : 'not installed';
    line("Versions:");
    line("  firebase/php-jwt       : " . $v('firebase/php-jwt'));
    line("  kreait/firebase-php    : " . $v('kreait/firebase-php'));
    line("  lcobucci/jwt           : " . $v('lcobucci/jwt'));
    line("  paragonie/sodium_compat: " . $v('paragonie/sodium_compat'));
    line("  phpoffice/phpspreadsheet: " . $v('phpoffice/phpspreadsheet'));
    line("  dompdf/dompdf          : " . $v('dompdf/dompdf'));
    line("  mpdf/mpdf              : " . $v('mpdf/mpdf'));
}

/** Sodium check (native or polyfill) */
$hasNativeSodium  = extension_loaded('sodium');
$hasPolyfill      = class_exists('ParagonIE_Sodium_Compat');
line("Sodium:");
line("  Native ext-sodium loaded : " . ($hasNativeSodium ? 'YES' : 'NO'));
line("  Polyfill sodium_compat   : " . ($hasPolyfill ? 'YES' : 'NO'));

/** JWT encode/decode using firebase/php-jwt */
try {
    $key = 'test-secret-key';
    $now = time();
    $payload = [
        'iss' => 'selfcheck',
        'sub' => 'dg',
        'iat' => $now,
        'exp' => $now + 60,
        'role'=> 'tester'
    ];

    $jwt = \Firebase\JWT\JWT::encode($payload, $key, 'HS256');
    $decoded = \Firebase\JWT\JWT::decode($jwt, new \Firebase\JWT\Key($key, 'HS256'));
    line("✅ JWT (firebase/php-jwt): encode/decode OK");
    line("  Token (truncated)       : " . substr($jwt, 0, 32) . "...");
    line("  Decoded.sub             : " . $decoded->sub);
} catch (Throwable $e) {
    line("❌ JWT test failed: " . $e->getMessage());
}

/** PhpSpreadsheet smoke test */
try {
    $ss = new \PhpOffice\PhpSpreadsheet\Spreadsheet();
    $ss->getActiveSheet()->setCellValue('A1', 'Hello DG');
    line("✅ PhpSpreadsheet: new Spreadsheet OK");
} catch (Throwable $e) {
    line("❌ PhpSpreadsheet failed: " . $e->getMessage());
}

/** Dompdf smoke test (render minimal HTML to memory) */
try {
    $dompdf = new \Dompdf\Dompdf();
    $dompdf->loadHtml('<h1>Hello DG</h1>');
    $dompdf->render(); // render to memory; no file output
    line("✅ Dompdf: render OK");
} catch (Throwable $e) {
    line("❌ Dompdf failed: " . $e->getMessage());
}

/** mPDF smoke test (create instance) */
try {
    $mpdf = new \Mpdf\Mpdf(['tempDir' => sys_get_temp_dir()]);
    $mpdf->WriteHTML('<h1>Hello DG</h1>');
    $mpdf->OutputBinaryData(); // to memory; no file output
    line("✅ mPDF: init/render OK");
} catch (Throwable $e) {
    line("❌ mPDF failed: " . $e->getMessage());
}

line("Self-check complete.");
