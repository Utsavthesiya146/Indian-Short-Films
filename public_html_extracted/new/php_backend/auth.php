<?php
/**
 * INDIAN SHORT MOVIE - Authentication API
 * Registration, Login, Logout, Session Verification
 */

require_once __DIR__ . '/config.php';

session_start();

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

if ($method === 'POST' && $action === 'register') {
    $raw = file_get_contents('php://input');
    $data = json_decode($raw, true) ?? [];

    $name     = sanitizeInput($data['name'] ?? '');
    $username = preg_replace('/[^a-zA-Z0-9_]/', '', strtolower(trim($data['username'] ?? '')));
    $email    = filter_var(trim($data['email'] ?? ''), FILTER_VALIDATE_EMAIL);
    $password = $data['password'] ?? '';
    $role     = in_array($data['role'] ?? '', ['user', 'creator'], true) ? $data['role'] : 'user';

    if (empty($name) || empty($username) || !$email || strlen($password) < 6) {
        jsonResponse(false, 'Valid name, username, email, and password (min 6 chars) required.', null, 400);
    }

    // Check existing
    $stmt = $pdo->prepare('SELECT id FROM users WHERE email = ? OR username = ? LIMIT 1');
    $stmt->execute([$email, $username]);
    if ($stmt->fetch()) {
        jsonResponse(false, 'Username or Email already registered.', null, 409);
    }

    $passwordHash = password_hash($password, PASSWORD_BCRYPT, ['cost' => 12]);
    $uuid = bin2hex(random_bytes(16));

    $insert = $pdo->prepare('INSERT INTO users (uuid, name, username, email, password_hash, role) VALUES (?, ?, ?, ?, ?, ?)');
    $insert->execute([$uuid, $name, $username, $email, $passwordHash, $role]);

    $newId = (int)$pdo->lastInsertId();
    $_SESSION['user_id'] = $newId;
    $_SESSION['username'] = $username;
    $_SESSION['role'] = $role;

    jsonResponse(true, 'Registration successful', [
        'id'       => $newId,
        'uuid'     => $uuid,
        'name'     => $name,
        'username' => $username,
        'email'    => $email,
        'role'     => $role
    ], 201);
}

if ($method === 'POST' && $action === 'login') {
    $raw = file_get_contents('php://input');
    $data = json_decode($raw, true) ?? [];

    $loginInput = trim($data['username_or_email'] ?? '');
    $password   = $data['password'] ?? '';

    if (empty($loginInput) || empty($password)) {
        jsonResponse(false, 'Username/Email and password required', null, 400);
    }

    $stmt = $pdo->prepare('SELECT id, uuid, name, username, email, password_hash, role, avatar, bio FROM users WHERE email = ? OR username = ? LIMIT 1');
    $stmt->execute([$loginInput, $loginInput]);
    $user = $stmt->fetch();

    if (!$user || !password_verify($password, $user['password_hash'])) {
        jsonResponse(false, 'Invalid credentials', null, 401);
    }

    $_SESSION['user_id'] = $user['id'];
    $_SESSION['username'] = $user['username'];
    $_SESSION['role'] = $user['role'];

    unset($user['password_hash']);
    jsonResponse(true, 'Login successful', $user, 200);
}

if ($action === 'logout') {
    $_SESSION = [];
    if (ini_get('session.use_cookies')) {
        $params = session_get_cookie_params();
        setcookie(session_name(), '', time() - 42000,
            $params['path'], $params['domain'],
            $params['secure'], $params['httponly']
        );
    }
    session_destroy();
    jsonResponse(true, 'Logged out successfully');
}

if ($action === 'me') {
    if (!isset($_SESSION['user_id'])) {
        jsonResponse(false, 'Not authenticated', null, 401);
    }
    $stmt = $pdo->prepare('SELECT id, uuid, name, username, email, role, avatar, bio FROM users WHERE id = ?');
    $stmt->execute([$_SESSION['user_id']]);
    $user = $stmt->fetch();
    jsonResponse(true, 'User session active', $user);
}

jsonResponse(false, 'Invalid action', null, 400);
