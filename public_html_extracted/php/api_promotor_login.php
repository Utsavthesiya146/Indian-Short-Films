<?php
/**
 * Indian Short Movie - Promotor Login API
 * Authenticates promotors via the `promotors` table.
 */
session_start();
header('Content-Type: application/json');
require_once __DIR__ . '/db.php';

// --- Ensure promotors table exists ---
try {
    $pdo->exec("CREATE TABLE IF NOT EXISTS `promotors` (
        `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        `name` VARCHAR(120) NOT NULL,
        `email` VARCHAR(180) NOT NULL UNIQUE,
        `password_hash` VARCHAR(255) NOT NULL,
        `company` VARCHAR(200) DEFAULT NULL,
        `phone` VARCHAR(30) DEFAULT NULL,
        `avatar_url` VARCHAR(255) DEFAULT NULL,
        `status` ENUM('active','inactive','suspended') DEFAULT 'active',
        `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;");

    // One-time migration: rename any old "Demo Promotor" record to "Promotor"
    $pdo->exec("UPDATE `promotors` SET `name` = 'Promotor' WHERE `name` = 'Demo Promotor'");
} catch (PDOException $ex) {
    // Table may already exist — continue
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'error' => 'Invalid request method.']);
    exit;
}

$data     = json_decode(file_get_contents('php://input'), true);
$email    = isset($data['email'])    ? trim($data['email'])    : '';
$password = isset($data['password']) ? trim($data['password']) : '';

if (empty($email) || empty($password)) {
    echo json_encode(['success' => false, 'error' => 'Email and password are required.']);
    exit;
}

try {
    $stmt = $pdo->prepare("SELECT * FROM promotors WHERE email = ? AND status = 'active' LIMIT 1");
    $stmt->execute([$email]);
    $promotor = $stmt->fetch();

    if ($promotor && password_verify($password, $promotor['password_hash'])) {
        $_SESSION['promotor_logged_in'] = true;
        $_SESSION['promotor_id']        = $promotor['id'];
        $_SESSION['promotor_name']      = $promotor['name'];
        $_SESSION['promotor_email']     = $promotor['email'];
        $_SESSION['promotor_company']   = $promotor['company'] ?? '';
        echo json_encode(['success' => true, 'name' => $promotor['name']]);
    } else {
        echo json_encode(['success' => false, 'error' => 'Invalid email or password.']);
    }
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'error' => 'Database error: ' . $e->getMessage()]);
}
?>
