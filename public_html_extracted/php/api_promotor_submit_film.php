<?php
/**
 * Indian Short Movie - Promotor Submit Film API
 * Allows logged-in promotors to submit new films.
 * Supports: poster URL/file upload + video URL/file upload
 */
session_start();
header('Content-Type: application/json');
require_once __DIR__ . '/db.php';

// Auth guard
if (!isset($_SESSION['promotor_logged_in']) || $_SESSION['promotor_logged_in'] !== true) {
    http_response_code(401);
    echo json_encode(['success' => false, 'error' => 'Unauthorized. Please log in as a Promotor.']);
    exit;
}

$promotor_id = (int)$_SESSION['promotor_id'];

// Add missing columns to film_submissions if needed
try {
    $pdo->exec("ALTER TABLE `film_submissions` ADD COLUMN IF NOT EXISTS `promotor_id` INT UNSIGNED DEFAULT NULL");
    $pdo->exec("ALTER TABLE `film_submissions` ADD COLUMN IF NOT EXISTS `poster_url` VARCHAR(500) DEFAULT NULL");
} catch (PDOException $ex) {}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'error' => 'POST required.']);
    exit;
}

// Read form fields
$title      = trim($_POST['title']      ?? '');
$director   = trim($_POST['director']   ?? '');
$language   = trim($_POST['language']   ?? '');
$genre      = trim($_POST['genre']      ?? 'Drama');
$video_url  = '';
$synopsis   = trim($_POST['synopsis']   ?? '');
$poster_url = trim($_POST['poster_url'] ?? '');

// --- Handle VIDEO file upload ---
if (!empty($_FILES['video_file']) && $_FILES['video_file']['error'] === UPLOAD_ERR_OK) {
    // Server-side 25 MB limit
    $max_size = 25 * 1024 * 1024;
    if ($_FILES['video_file']['size'] > $max_size) {
        echo json_encode(['success' => false, 'error' => 'Video file is too large. Maximum allowed size is 25 MB.']);
        exit;
    }

    $vid_upload_dir = __DIR__ . '/../uploads/videos/';
    if (!is_dir($vid_upload_dir)) { mkdir($vid_upload_dir, 0755, true); }
    $vid_ext     = strtolower(pathinfo($_FILES['video_file']['name'], PATHINFO_EXTENSION));
    $vid_allowed = ['mp4', 'mov', 'avi', 'webm'];
    if (in_array($vid_ext, $vid_allowed)) {
        $vid_filename = 'video_' . uniqid() . '.' . $vid_ext;
        if (move_uploaded_file($_FILES['video_file']['tmp_name'], $vid_upload_dir . $vid_filename)) {
            $video_url = 'uploads/videos/' . $vid_filename;
        }
    } else {
        echo json_encode(['success' => false, 'error' => 'Unsupported video format. Please upload MP4, MOV, AVI, or WEBM.']);
        exit;
    }
}

// --- Handle POSTER file upload ---
if (!empty($_FILES['poster_file']) && $_FILES['poster_file']['error'] === UPLOAD_ERR_OK) {
    $img_upload_dir = __DIR__ . '/../uploads/posters/';
    if (!is_dir($img_upload_dir)) { mkdir($img_upload_dir, 0755, true); }
    $img_ext     = strtolower(pathinfo($_FILES['poster_file']['name'], PATHINFO_EXTENSION));
    $img_allowed = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
    if (in_array($img_ext, $img_allowed)) {
        $img_filename = 'poster_' . uniqid() . '.' . $img_ext;
        if (move_uploaded_file($_FILES['poster_file']['tmp_name'], $img_upload_dir . $img_filename)) {
            $poster_url = 'uploads/posters/' . $img_filename;
        }
    }
}

// Validate required fields
if (empty($title) || empty($director) || empty($language)) {
    echo json_encode(['success' => false, 'error' => 'Title, director, and language are required.']);
    exit;
}
if (empty($video_url)) {
    echo json_encode(['success' => false, 'error' => 'A video file upload is required. Please upload an MP4, MOV, AVI, or WEBM file.']);
    exit;
}

// Validate genre
$allowed_genres = ['Drama','Suspense','Thriller','Romance','Comedy','Horror','Action','Documentary','Other'];
if (empty($genre) || !in_array($genre, $allowed_genres)) {
    echo json_encode(['success' => false, 'error' => 'Please select a valid Genre.']);
    exit;
}

// Ensure genre column exists
try {
    $pdo->exec("ALTER TABLE `film_submissions` ADD COLUMN IF NOT EXISTS `genre` VARCHAR(60) NOT NULL DEFAULT 'Drama'");
} catch (PDOException $ex) {}

try {
    $stmt = $pdo->prepare("INSERT INTO film_submissions 
        (title, director, language, genre, video_url, poster_url, synopsis, status, promotor_id) 
        VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', ?)");
    $stmt->execute([$title, $director, $language, $genre, $video_url, $poster_url ?: null, $synopsis, $promotor_id]);
    $new_id = $pdo->lastInsertId();
    echo json_encode([
        'success'       => true,
        'submission_id' => $new_id,
        'message'       => 'Film submitted successfully! It will be reviewed by the admin.'
    ]);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'error' => 'Database error: ' . $e->getMessage()]);
}
?>
