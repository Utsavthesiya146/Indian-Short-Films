<?php
session_start();
header('Content-Type: application/json');
require_once __DIR__ . '/db.php';

// Ensure settings table exists
$pdo->exec("CREATE TABLE IF NOT EXISTS settings (
    setting_key VARCHAR(50) PRIMARY KEY,
    setting_value TEXT
)");

// Initialize default settings if they don't exist
$defaults = [
    'play_store_url' => '#',
    'app_store_url' => '#',
    'admin_email' => 'info@jobhunterr.com',
    'admin_password' => 'Indiansmartmov@123'
];

foreach ($defaults as $key => $val) {
    $stmt = $pdo->prepare("INSERT IGNORE INTO settings (setting_key, setting_value) VALUES (?, ?)");
    $stmt->execute([$key, $val]);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Basic auth check for saving settings - now checks admin_logged_in
    if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
        echo json_encode(['success' => false, 'error' => 'Not authenticated as admin']);
        exit;
    }
    
    $data = json_decode(file_get_contents('php://input'), true);
    if ($data) {
        foreach ($data as $key => $value) {
            // If they pass an empty password, don't update it
            if ($key === 'admin_password' && empty($value)) {
                continue;
            }
            $stmt = $pdo->prepare("UPDATE settings SET setting_value = ? WHERE setting_key = ?");
            $stmt->execute([$value, $key]);
        }
        echo json_encode(['success' => true]);
        exit;
    }
    echo json_encode(['success' => false, 'error' => 'Invalid data']);
    exit;
}

// GET request: fetch settings
$stmt = $pdo->query("SELECT setting_key, setting_value FROM settings");
$settings = [];
while ($row = $stmt->fetch()) {
    // Hide password from frontend API response
    if ($row['setting_key'] === 'admin_password') {
        continue;
    }
    $settings[$row['setting_key']] = $row['setting_value'];
}
echo json_encode(['success' => true, 'settings' => $settings]);
?>
