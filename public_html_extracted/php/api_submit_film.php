<?php
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["error" => "Method not allowed"]);
    exit;
}

require_once __DIR__ . '/cors.php';

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(["error" => "Unauthorized"]);
    exit;
}


// Handle both JSON and FormData requests
if (!empty($_POST)) {
    $title    = $_POST['title'] ?? '';
    $director = $_POST['director'] ?? '';
    $language = $_POST['language'] ?? '';
    $genre    = $_POST['genre'] ?? '';
    $synopsis = $_POST['synopsis'] ?? '';
    $poster_url = $_POST['poster_url'] ?? '';
} else {
    $input = json_decode(file_get_contents('php://input'), true);
    $title    = $input['title'] ?? '';
    $director = $input['director'] ?? '';
    $language = $input['language'] ?? '';
    $genre    = $input['genre'] ?? '';
    $synopsis = $input['synopsis'] ?? '';
    $poster_url = $input['poster_url'] ?? '';
}
$video_url = '';

// Handle Video File Upload if present
if (isset($_FILES['video_file']) && $_FILES['video_file']['error'] === UPLOAD_ERR_OK) {
    // Server-side size check: 25 MB
    $max_size = 25 * 1024 * 1024;
    if ($_FILES['video_file']['size'] > $max_size) {
        http_response_code(400);
        echo json_encode(["error" => "Video file is too large. Maximum allowed size is 25 MB."]);
        exit;
    }

    $uploadDir = __DIR__ . '/../uploads/videos/';
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }
    $fileInfo = pathinfo($_FILES['video_file']['name']);
    $ext = strtolower($fileInfo['extension'] ?? '');
    $allowed_ext = ['mp4', 'mov', 'avi', 'webm'];

    if (in_array($ext, $allowed_ext)) {
        $filename = 'film_' . uniqid() . '.' . $ext;
        $destPath = $uploadDir . $filename;
        if (move_uploaded_file($_FILES['video_file']['tmp_name'], $destPath)) {
            $video_url = 'uploads/videos/' . $filename;
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Failed to save uploaded video file."]);
            exit;
        }
    } else {
        http_response_code(400);
        echo json_encode(["error" => "Unsupported video format. Please upload MP4, MOV, AVI, or WEBM."]);
        exit;
    }
}

// Handle Poster/Thumbnail Image Upload if present
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
            $poster_url = 'uploads/posters/' . $posterFilename;
        }
    }
}

// Validate allowed genre values
$allowed_genres = ['Drama','Suspense','Thriller','Romance','Comedy','Horror','Action','Documentary','Other'];
if (empty($genre) || !in_array($genre, $allowed_genres)) {
    http_response_code(400);
    echo json_encode(["error" => "Please select a valid Genre."]);
    exit;
}

if (!$title || !$director || !$language || !$synopsis) {
    http_response_code(400);
    echo json_encode(["error" => "All fields (Title, Director, Language, Synopsis) are required."]);
    exit;
}

if (!$video_url) {
    http_response_code(400);
    echo json_encode(["error" => "A video file upload is required. Please upload an MP4, MOV, AVI, or WEBM file."]);
    exit;
}

@include_once __DIR__ . '/db.php';

if (isset($pdo) && $pdo instanceof PDO) {
    try {
        // Ensure genre column exists (safe to run each time)
        $pdo->exec("ALTER TABLE `film_submissions` ADD COLUMN IF NOT EXISTS `genre` VARCHAR(60) NOT NULL DEFAULT 'Drama'");
        $pdo->exec("ALTER TABLE `film_submissions` ADD COLUMN IF NOT EXISTS `user_id` INT DEFAULT NULL");
        $pdo->exec("ALTER TABLE `film_submissions` ADD COLUMN IF NOT EXISTS `poster_url` TEXT DEFAULT NULL");

        $user_id = $_SESSION['user_id'];
        $stmt = $pdo->prepare("INSERT INTO film_submissions (user_id, title, director, language, genre, video_url, poster_url, synopsis) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([$user_id, $title, $director, $language, $genre, $video_url, $poster_url ?: null, $synopsis]);

        echo json_encode(["success" => true, "message" => "Film submitted successfully."]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["error" => "Database error: " . $e->getMessage()]);
    }
} else {
    http_response_code(500);
    echo json_encode(["error" => "Database connection unavailable"]);
}
?>
