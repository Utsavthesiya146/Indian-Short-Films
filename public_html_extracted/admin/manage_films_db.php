<?php
session_start();
require_once __DIR__ . '/../php/db.php';

// Only allow if admin is logged in
if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    die(json_encode(['error' => 'Unauthorized']));
}

$action = $_GET['action'] ?? '';

if ($action === 'list') {
    $stmt = $pdo->query("SELECT id, title, director, language FROM films ORDER BY id DESC");
    $films = $stmt->fetchAll(PDO::FETCH_ASSOC);
    header('Content-Type: application/json');
    echo json_encode(['films' => $films, 'count' => count($films)]);
    exit;
}

if ($action === 'delete_all' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $pdo->exec("DELETE FROM films");
    $pdo->exec("DELETE FROM film_submissions");
    header('Content-Type: application/json');
    echo json_encode(['success' => true, 'message' => 'All films deleted successfully']);
    exit;
}

if ($action === 'delete_one' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $id = json_decode(file_get_contents('php://input'), true)['id'] ?? null;
    if ($id) {
        $stmt = $pdo->prepare("DELETE FROM films WHERE id = ?");
        $stmt->execute([$id]);
        header('Content-Type: application/json');
        echo json_encode(['success' => true]);
    }
    exit;
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Film Database Manager</title>
<style>
body { background: #0a0a0f; color: white; font-family: sans-serif; padding: 2rem; }
h1 { color: #e94560; }
table { width: 100%; border-collapse: collapse; margin: 1rem 0; }
th, td { padding: 12px; border: 1px solid #333; text-align: left; }
th { background: #1a1a2e; }
.btn { padding: 8px 16px; border: none; border-radius: 8px; cursor: pointer; font-weight: bold; }
.btn-danger { background: #e94560; color: white; }
.btn-danger-outline { background: transparent; border: 1px solid #e94560; color: #e94560; }
.btn-danger:hover { background: #c73652; }
#status { padding: 1rem; border-radius: 8px; margin: 1rem 0; display: none; }
.success { background: #10b98120; border: 1px solid #10b981; color: #10b981; }
.count { font-size: 1.2rem; font-weight: bold; color: #e94560; margin-bottom: 1rem; }
</style>
</head>
<body>
<h1>🎬 Film Database Manager</h1>
<div id="status"></div>
<div class="count" id="film-count">Loading...</div>
<button class="btn btn-danger" onclick="deleteAll()">🗑️ Delete ALL Films from Database</button>
<table id="films-table">
<thead><tr><th>ID</th><th>Title</th><th>Director</th><th>Language</th><th>Action</th></tr></thead>
<tbody id="films-tbody"></tbody>
</table>
<script>
async function loadFilms() {
    const res = await fetch('?action=list');
    const data = await res.json();
    document.getElementById('film-count').textContent = data.count + ' film(s) in database';
    document.getElementById('films-tbody').innerHTML = data.films.map(f => `
        <tr>
            <td>${f.id}</td>
            <td>${f.title}</td>
            <td>${f.director}</td>
            <td>${f.language}</td>
            <td><button class="btn btn-danger-outline" onclick="deleteOne(${f.id})">Delete</button></td>
        </tr>
    `).join('') || '<tr><td colspan="5" style="text-align:center;color:#666">No films in database</td></tr>';
}

async function deleteOne(id) {
    if (!confirm('Delete this film?')) return;
    await fetch('?action=delete_one', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({id}) });
    showStatus('Film deleted!');
    loadFilms();
}

async function deleteAll() {
    if (!confirm('Delete ALL films from the database? The website will show 0 films.')) return;
    const res = await fetch('?action=delete_all', { method: 'POST' });
    const data = await res.json();
    if (data.success) { showStatus('✅ All films deleted successfully!'); loadFilms(); }
}

function showStatus(msg) {
    const el = document.getElementById('status');
    el.textContent = msg; el.className = 'success'; el.style.display = 'block';
    setTimeout(() => el.style.display = 'none', 3000);
}

loadFilms();
</script>
</body>
</html>
