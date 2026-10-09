<?php
/**
 * Indian Short Movie - Sign Up API
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
$name = trim($input['name'] ?? '');

if (!$email || empty($password) || empty($name)) {
    http_response_code(400);
    echo json_encode(["error" => "Please enter your name, a valid email address and password."]);
    exit;
}

$user_id = 'usr_' . substr(md5($email), 0, 10);
$username = explode('@', $email)[0];

@include_once __DIR__ . '/db.php';

if (isset($pdo) && $pdo instanceof PDO) {
    try {
        // 1. Ensure users table exists
        // (Table creation logic moved to mobile_app_tables.sql)

        // 2. Check if user already exists
        $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ? LIMIT 1");
        $stmt->execute([$email]);
        $existing = $stmt->fetch();

        if ($existing) {
            http_response_code(409);
            echo json_encode(["error" => "User with this email already exists."]);
            exit;
        }

        // 3. Insert new user
        $hash = password_hash($password, PASSWORD_DEFAULT);
        $uuid = bin2hex(random_bytes(16));
        
        $uname = $username;
        $chk = $pdo->prepare("SELECT id FROM users WHERE username = ?");
        $chk->execute([$uname]);
        if ($chk->fetch()) {
            $uname = $username . rand(10, 999);
        }

        $ins = $pdo->prepare("INSERT INTO users (uuid, name, username, email, password_hash, role) VALUES (?, ?, ?, ?, ?, 'user')");
        $ins->execute([$uuid, $name, $uname, $email, $hash]);
        $user_id = $pdo->lastInsertId();
        
    } catch (Exception $e) {
        // Fallback to session
    }
}

// Set PHP session
$_SESSION['user_id'] = $user_id;
$_SESSION['user_email'] = $email;

// Send Welcome Email
$to = $email;
$subject = "🎬 Welcome to Indian Short Movies!";
$headers = "MIME-Version: 1.0\r\n"
         . "Content-Type: text/html; charset=UTF-8\r\n"
         . "From: noreply@indianshortmovies.com\r\n"
         . "Reply-To: support@indianshortmovies.com\r\n"
         . "X-Mailer: PHP/" . phpversion();

$message = "
<html>
<head>
  <style>
    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #333333; line-height: 1.6; margin: 0; padding: 0; }
    .logo-container { background-color: #07080B; padding: 30px 20px; text-align: center; border-bottom: 1px solid #262A36; margin-bottom: 25px; }
    .logo-wrapper { display: inline-block; font-size: 28px; font-weight: 900; color: #ffffff; letter-spacing: -0.5px; }
    .logo-badge { 
        background: linear-gradient(to right, #f84464, #dc2626, #8b5cf6); 
        background-color: #dc2626; 
        color: white; 
        padding: 4px 12px; 
        border-radius: 20px; 
        font-size: 19px; 
        margin: 0 6px; 
        display: inline-block;
        vertical-align: middle;
        box-shadow: 0 4px 6px rgba(0,0,0,0.3);
    }
    .play-icon {
        display: inline-block;
        background-color: white;
        color: #dc2626;
        border-radius: 50%;
        width: 18px;
        height: 18px;
        font-size: 11px;
        line-height: 18px;
        text-align: center;
        vertical-align: middle;
        margin-left: 4px;
        margin-top: -2px;
    }
    .tagline-container { margin-top: 8px; text-align: center; }
    .tagline-text { color: #9ca3af; font-size: 10px; font-weight: bold; letter-spacing: 3px; text-transform: uppercase; }
    .tagline-line { display: inline-block; width: 24px; height: 1px; background-color: #FF204E; vertical-align: middle; margin: 0 8px; }
    .content { padding: 10px 20px 30px 20px; max-width: 600px; margin: 0 auto; }
    .footer { margin-top: 40px; font-size: 12px; color: #777777; border-top: 1px solid #eeeeee; padding-top: 20px; text-align: center; }
  </style>
</head>
<body>
  <div class='logo-container'>
    <div class='logo-wrapper'>
      indian<span class='logo-badge'>short<span class='play-icon'>►</span></span>movie
    </div>
    <div class='tagline-container'>
      <span class='tagline-line'></span>
      <span class='tagline-text'>India's Stories on Screen</span>
      <span class='tagline-line'></span>
    </div>
  </div>
  <div class='content'>
    <p>Hello <strong>" . htmlspecialchars($name) . "</strong>,</p>
    
    <p>Welcome to Indian Short Movies! 🎥</p>
    
    <p>Your account has been successfully created.</p>
    
    <p>You can now:</p>
    <ul style='list-style-type: none; padding-left: 0;'>
      <li>🎬 Create and manage your profile</li>
      <li>📽️ Submit your short films</li>
      <li>🌟 Showcase your work</li>
      <li>🔎 Discover independent Indian cinema</li>
      <li>🤝 Be part of our growing filmmaker community</li>
    </ul>
    
    <p>We’re excited to have you with us!</p>
    
    <p>Best Regards,<br>
    <strong>The Indian Short Movies Team</strong><br>
    <a href='https://www.indianshortmovies.com'>www.indianshortmovies.com</a></p>
    
    <div class='footer'>
      Thank you for joining Indian Short Movies. Your account has been successfully created. Start exploring, creating, and sharing your stories with our growing film community.
    </div>
  </div>
</body>
</html>
";

@mail($to, $subject, $message, $headers);

echo json_encode([
    "success" => true,
    "message" => "Registered successfully!",
    "user" => [
        "id" => $_SESSION['user_id'],
        "email" => $_SESSION['user_email'],
        "username" => $username
    ]
]);
?>

