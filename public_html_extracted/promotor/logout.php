<?php
/**
 * Indian Short Movie - Promotor Logout
 */
session_start();
$_SESSION['promotor_logged_in'] = false;
$_SESSION['promotor_id']        = null;
$_SESSION['promotor_name']      = null;
$_SESSION['promotor_email']     = null;
$_SESSION['promotor_company']   = null;
session_destroy();
header('Location: login.php');
exit;
?>
