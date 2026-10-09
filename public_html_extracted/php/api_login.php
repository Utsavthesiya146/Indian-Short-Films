<?php
/**
 * Indian Short Movie - Sign In API
 */
require_once __DIR__ . '/cors.php';
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["error" => "Method not allowed"]);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);

$email = filter_var($input['email'] ?? '', FILTER_VALIDATE_EMAIL);
$password = trim($input['password'] ?? '');

if (!$email || empty($password)) {
    http_response_code(400);
    echo json_encode(["error" => "Please enter a valid email address and password."]);
    exit;
}

// Default user details
$user_id = 'usr_' . substr(md5($email), 0, 10);
$username = explode('@', $email)[0];

@include_once __DIR__ . '/db.php';

if (isset($pdo) && $pdo instanceof PDO) {
    try {
        // 1. Ensure users table exists
        $pdo->exec("CREATE TABLE IF NOT EXISTS `users` (
            `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            `uuid` VARCHAR(64) NOT NULL UNIQUE,
            `name` VARCHAR(120) NOT NULL,
            `username` VARCHAR(60) NOT NULL UNIQUE,
            `email` VARCHAR(191) NOT NULL UNIQUE,
            `password_hash` VARCHAR(255) NOT NULL,
            `role` VARCHAR(20) DEFAULT 'user',
            `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            INDEX `idx_username` (`username`),
            INDEX `idx_email` (`email`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

        // 2. Check if user exists
        $stmt = $pdo->prepare("SELECT id, password_hash FROM users WHERE email = ? LIMIT 1");
        $stmt->execute([$email]);
        $existing = $stmt->fetch();

        if ($existing) {
            $user_id = $existing['id'];
        } else {
            // 3. Auto-insert user into DB on first sign-in
            $hash = password_hash($password, PASSWORD_DEFAULT);
            $uuid = bin2hex(random_bytes(16));
            
            // Generate unique username if needed
            $uname = $username;
            $chk = $pdo->prepare("SELECT id FROM users WHERE username = ?");
            $chk->execute([$uname]);
            if ($chk->fetch()) {
                $uname = $username . rand(10, 999);
            }

            $ins = $pdo->prepare("INSERT INTO users (uuid, name, username, email, password_hash, role) VALUES (?, ?, ?, ?, ?, 'user')");
            $ins->execute([$uuid, $username, $uname, $email, $hash]);
            $user_id = $pdo->lastInsertId();
        }
    } catch (Exception $e) {
        // Fallback to session
    }
}

// Set PHP session
$_SESSION['user_id'] = $user_id;
$_SESSION['user_email'] = $email;

echo json_encode([
    "success" => true,
    "message" => "Signed in successfully!",
    "user" => [
        "id" => $_SESSION['user_id'],
        "email" => $_SESSION['user_email'],
        "username" => $username
    ]
]);
?>
