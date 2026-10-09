<?php
/**
 * Indian Short Movie - Add Film API
 */
require_once __DIR__ . '/db.php';
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["error" => "Method not allowed"]);
    exit;
}

// Support both FormData ($_POST & $_FILES) and raw JSON body
if (!empty($_POST) || !empty($_FILES)) {
    $title = $_POST['title'] ?? 'Untitled Film';
    $director = $_POST['director'] ?? 'Unknown Director';
    $language = $_POST['language'] ?? 'Hindi';
    $genre = $_POST['genre'] ?? 'Drama';
    $duration = $_POST['duration'] ?? '15 mins';
    $synopsis = $_POST['synopsis'] ?? 'New independent short film added to the catalog.';
} else {
    $input = json_decode(file_get_contents('php://input'), true);
    $title = $input['title'] ?? 'Untitled Film';
    $director = $input['director'] ?? 'Unknown Director';
    $language = $input['language'] ?? 'Hindi';
    $genre = $input['genre'] ?? 'Drama';
    $duration = $input['duration'] ?? '15 mins';
    $synopsis = $input['synopsis'] ?? 'New independent short film added to the catalog.';
}

$videoUrl = '';
$posterUrl = 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=800&q=80';

// Handle Video File Upload if provided
if (isset($_FILES['video_file']) && $_FILES['video_file']['error'] === UPLOAD_ERR_OK) {
    // Server-side size check: 25 MB
    $max_size = 25 * 1024 * 1024;
    if ($_FILES['video_file']['size'] > $max_size) {
        http_response_code(400);
        echo json_encode(["error" => "Video file is too large. Maximum allowed size is 25 MB."]);
        exit;
    }

    $videoDir = __DIR__ . '/../uploads/videos/';
    if (!is_dir($videoDir)) {
        mkdir($videoDir, 0755, true);
    }
    
    $fileInfo = pathinfo($_FILES['video_file']['name']);
    $ext = strtolower($fileInfo['extension'] ?? '');
    $allowed_video_ext = ['mp4', 'webm', 'mov', 'avi'];
    
    if (in_array($ext, $allowed_video_ext)) {
        $videoFilename = 'film_' . uniqid() . '.' . $ext;
        $destPath = $videoDir . $videoFilename;
        if (move_uploaded_file($_FILES['video_file']['tmp_name'], $destPath)) {
            $videoUrl = 'uploads/videos/' . $videoFilename;
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Failed to save uploaded video file."]);
            exit;
        }
    } else {
        http_response_code(400);
        echo json_encode(["error" => "Invalid video format. Allowed: MP4, WEBM, MOV, AVI."]);
        exit;
    }
}

// Handle Poster Image Upload if provided
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
            $posterUrl = 'uploads/posters/' . $posterFilename;
        }
    }
}

if (!$videoUrl) {
    http_response_code(400);
    echo json_encode(["error" => "Please select a Video File to upload."]);
    exit;
}

// Generate a unique ID
$id = 'film-' . uniqid() . rand(1000, 9999);
$backdropUrl = $posterUrl;

try {
    $stmt = $pdo->prepare("INSERT INTO films (uuid, creator_id, title, description, synopsis, video_url, poster_url, duration, genre, language, director, status) VALUES (?, 1, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'approved')");
    $stmt->execute([$id, $title, $synopsis, $synopsis, $videoUrl, $posterUrl, $duration, $genre, $language, $director]);
    
    echo json_encode(["success" => true, "id" => $id, "video_url" => $videoUrl]);
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Failed to add film: " . $e->getMessage()]);
}
?>
