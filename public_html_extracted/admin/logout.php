<?php
session_start();
$_SESSION['admin_logged_in'] = false;
unset($_SESSION['admin_logged_in']);
header('Location: login.php');
exit;
?>
