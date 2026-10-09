<?php
/**
 * INDIAN SHORT MOVIE - Secure File Upload API
 * Handles short vertical video, film, and poster uploads
 */

require_once __DIR__ . '/config.php';

session_start();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(false, 'Only POST requests allowed', null, 405);
}

// Ensure user is logged in
if (!isset($_SESSION['user_id'])) {
    jsonResponse(false, 'Unauthorized. Please login to upload.', null, 401);
}

$uploadType = $_POST['type'] ?? 'video'; // 'video' or 'poster'
$maxVideoBytes = 150 * 1024 * 1024; // 150MB
$maxImageBytes = 10 * 1024 * 1024;  // 10MB

if (empty($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
    $errCode = $_FILES['file']['error'] ?? 'No file';
    jsonResponse(false, "Upload error occurred: {$errCode}", null, 400);
}

$file = $_FILES['file'];
$tmpPath = $file['tmp_name'];
$originalName = $file['name'];
$fileSize = $file['size'];

$finfo = new finfo(FILEINFO_MIME_TYPE);
$mime = $finfo->file($tmpPath);

$targetDir = __DIR__ . '/../public/uploads/';
if (!is_dir($targetDir)) {
    mkdir($targetDir, 0755, true);
}

if ($uploadType === 'video') {
    $allowedMimes = ['video/mp4', 'video/webm', 'video/quicktime'];
    $allowedExts  = ['mp4', 'webm', 'mov'];

    if ($fileSize > $maxVideoBytes) {
        jsonResponse(false, 'Video exceeds maximum size limit (150MB).', null, 400);
    }
} else {
    $allowedMimes = ['image/jpeg', 'image/png', 'image/webp'];
    $allowedExts  = ['jpg', 'jpeg', 'png', 'webp'];

    if ($fileSize > $maxImageBytes) {
        jsonResponse(false, 'Image exceeds maximum size limit (10MB).', null, 400);
    }
}

$ext = strtolower(pathinfo($originalName, PATHINFO_EXTENSION));

if (!in_array($mime, $allowedMimes, true) || !in_array($ext, $allowedExts, true)) {
    jsonResponse(false, 'Invalid file format or spoofed extension.', ['mime' => $mime, 'ext' => $ext], 415);
}

// Generate collision-resistant secure filename
$safeName = $uploadType . '_' . bin2hex(random_bytes(16)) . '.' . $ext;
$destination = $targetDir . $safeName;

if (!move_uploaded_file($tmpPath, $destination)) {
    jsonResponse(false, 'Failed to store uploaded file on server.', null, 500);
}

$publicUrl = '/uploads/' . $safeName;

jsonResponse(true, 'File uploaded successfully', [
    'url'          => $publicUrl,
    'originalName' => sanitizeInput($originalName),
    'size'         => $fileSize,
    'mime'         => $mime
], 201);
