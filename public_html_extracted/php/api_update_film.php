<?php
/**
 * Indian Short Movie - Update Film API
 * Supports updating poster_url (thumbnail) by URL or file upload
 */
require_once __DIR__ . '/db.php';
header('Content-Type: application/json');
session_start();

if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    http_response_code(401);
    echo json_encode(["error" => "Unauthorized"]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["error" => "Method not allowed"]);
    exit;
}

// --- Determine film ID ---
$filmId = null;
$newPosterUrl = null;
$newTitle = null;
$newDirector = null;
$newDuration = null;
$newGenre = null;
$newLanguage = null;
$newSynopsis = null;
$newVideoUrl = null;

if (!empty($_POST)) {
    $filmId    = $_POST['id'] ?? null;
    $newPosterUrl = $_POST['posterUrl'] ?? null;
    $newTitle     = $_POST['title'] ?? null;
    $newDirector  = $_POST['director'] ?? null;
    $newDuration  = $_POST['duration'] ?? null;
    $newGenre     = $_POST['genre'] ?? null;
    $newLanguage  = $_POST['language'] ?? null;
    $newSynopsis  = $_POST['synopsis'] ?? null;
    $newVideoUrl  = $_POST['videoUrl'] ?? null;
} else {
    $input = json_decode(file_get_contents('php://input'), true) ?? [];
    $filmId       = $input['id'] ?? null;
    $newPosterUrl = $input['posterUrl'] ?? null;
    $newTitle     = $input['title'] ?? null;
    $newDirector  = $input['director'] ?? null;
    $newDuration  = $input['duration'] ?? null;
    $newGenre     = $input['genre'] ?? null;
    $newLanguage  = $input['language'] ?? null;
    $newSynopsis  = $input['synopsis'] ?? null;
    $newVideoUrl  = $input['videoUrl'] ?? null;
}

if (!$filmId) {
    http_response_code(400);
    echo json_encode(["error" => "Film ID is required"]);
    exit;
}

// --- Handle poster file upload ---
if (isset($_FILES['poster_file']) && $_FILES['poster_file']['error'] === UPLOAD_ERR_OK) {
    $posterDir = __DIR__ . '/../uploads/posters/';
    if (!is_dir($posterDir)) {
        mkdir($posterDir, 0755, true);
    }
    $fileInfo = pathinfo($_FILES['poster_file']['name']);
    $ext = strtolower($fileInfo['extension'] ?? '');
    $allowed_img_ext = ['jpg', 'jpeg', 'png', 'webp', 'gif'];

    if (in_array($ext, $allowed_img_ext)) {
        $posterFilename = 'poster_' . uniqid() . '.' . $ext;
        $destPath = $posterDir . $posterFilename;
        if (move_uploaded_file($_FILES['poster_file']['tmp_name'], $destPath)) {
            $newPosterUrl = 'uploads/posters/' . $posterFilename;
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Failed to save uploaded poster image."]);
            exit;
        }
    } else {
        http_response_code(400);
        echo json_encode(["error" => "Invalid image format. Allowed: JPG, PNG, WEBP, GIF."]);
        exit;
    }
}

// --- Handle video file upload ---
if (isset($_FILES['video_file']) && $_FILES['video_file']['error'] === UPLOAD_ERR_OK) {
    $videoDir = __DIR__ . '/../uploads/videos/';
    if (!is_dir($videoDir)) {
        mkdir($videoDir, 0755, true);
    }
    $fileInfo = pathinfo($_FILES['video_file']['name']);
    $ext = strtolower($fileInfo['extension'] ?? '');
    $allowed_video_ext = ['mp4', 'webm', 'mov', 'avi', 'mkv'];

    if (in_array($ext, $allowed_video_ext)) {
        $videoFilename = 'film_' . uniqid() . '.' . $ext;
        $destPath = $videoDir . $videoFilename;
        if (move_uploaded_file($_FILES['video_file']['tmp_name'], $destPath)) {
            $newVideoUrl = 'uploads/videos/' . $videoFilename;
        }
    }
}

// --- Build dynamic UPDATE query ---
$sets = [];
$params = [];

if ($newPosterUrl !== null && $newPosterUrl !== '') {
    $sets[] = "poster_url = ?";
    $params[] = $newPosterUrl;
}
if ($newTitle !== null && $newTitle !== '') {
    $sets[] = "title = ?";
    $params[] = $newTitle;
}
if ($newDirector !== null && $newDirector !== '') {
    $sets[] = "director = ?";
    $params[] = $newDirector;
}
if ($newDuration !== null && $newDuration !== '') {
    $sets[] = "duration = ?";
    $params[] = $newDuration;
}
if ($newGenre !== null && $newGenre !== '') {
    $sets[] = "genre = ?";
    $params[] = $newGenre;
}
if ($newLanguage !== null && $newLanguage !== '') {
    $sets[] = "language = ?";
    $params[] = $newLanguage;
}
if ($newSynopsis !== null && $newSynopsis !== '') {
    $sets[] = "synopsis = ?";
    $params[] = $newSynopsis;
    $sets[] = "description = ?";
    $params[] = $newSynopsis;
}
if ($newVideoUrl !== null && $newVideoUrl !== '') {
    $sets[] = "video_url = ?";
    $params[] = $newVideoUrl;
}

if (empty($sets)) {
    http_response_code(400);
    echo json_encode(["error" => "No fields provided to update."]);
    exit;
}

// Match by numeric id OR uuid
$params[] = $filmId;
$params[] = $filmId;

try {
    $sql = "UPDATE films SET " . implode(", ", $sets) . " WHERE id = ? OR uuid = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);

    if ($stmt->rowCount() > 0) {
        echo json_encode(["success" => true, "message" => "Film updated successfully.", "poster_url" => $newPosterUrl]);
    } else {
        echo json_encode(["success" => false, "error" => "Film not found or no changes made."]);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Database error: " . $e->getMessage()]);
}
?>
