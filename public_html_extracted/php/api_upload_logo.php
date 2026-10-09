<?php
session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    echo json_encode(['success' => false, 'error' => 'Unauthorized: Admin login required']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'error' => 'Invalid request method']);
    exit;
}

if (!isset($_FILES['logo_file']) || $_FILES['logo_file']['error'] !== UPLOAD_ERR_OK) {
    echo json_encode(['success' => false, 'error' => 'No file uploaded or upload error occurred']);
    exit;
}

$file = $_FILES['logo_file'];

// Max size 5MB for logo
if ($file['size'] > 5 * 1024 * 1024) {
    echo json_encode(['success' => false, 'error' => 'Logo file size exceeds limit (5 MB maximum)']);
    exit;
}

$allowed_extensions = ['png', 'jpg', 'jpeg', 'webp'];
$ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));

if (!in_array($ext, $allowed_extensions)) {
    echo json_encode(['success' => false, 'error' => 'Invalid image format. Supported formats: PNG, JPG, WEBP']);
    exit;
}

$uploads_dir = __DIR__ . '/../uploads';
if (!is_dir($uploads_dir)) {
    mkdir($uploads_dir, 0755, true);
}

$target_file = $uploads_dir . '/logo.png';

// Move uploaded file to uploads/logo.png
if (move_uploaded_file($file['tmp_name'], $target_file)) {
    echo json_encode([
        'success' => true,
        'logo_url' => 'uploads/logo.png',
        'message' => 'Logo updated successfully'
    ]);
} else {
    echo json_encode(['success' => false, 'error' => 'Failed to save logo file to uploads directory']);
}
?>
