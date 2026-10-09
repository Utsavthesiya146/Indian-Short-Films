<?php
/**
 * Indian Short Movie - Database Connection
 * Production-ready PDO Connection
 */

$config_path = dirname(__DIR__, 2) . '/db_config.php';
if (file_exists($config_path)) {
    require_once $config_path;
} else {
    // Fallback for local development or if config is not moved yet, using environment variables
    define('DB_HOST', getenv('DB_HOST') ?: 'localhost');
    define('DB_NAME', getenv('DB_NAME') ?: 'u847123734_ISM');
    define('DB_USER', getenv('DB_USER') ?: 'u847123734_ISM_indianfilm');
    define('DB_PASS', getenv('DB_PASS') ?: 'ISM@hostingbaba0987');
}

try {
    $pdo = new PDO("mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4", DB_USER, DB_PASS);
    // Set PDO error mode to exception
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    // Use associative arrays by default
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
    try {
        $pdo->exec("CREATE TABLE IF NOT EXISTS `watchlists` (
            `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            `user_id` INT UNSIGNED NOT NULL,
            `film_id` VARCHAR(100) NOT NULL,
            `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            INDEX `idx_user_id` (`user_id`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");
    } catch(PDOException $e) {}
} catch(PDOException $e) {
    die("Database Connection Failed: " . $e->getMessage());
}
?>

