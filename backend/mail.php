<?php
include_once 'admin.php';

class Mail extends Admin {

}

$mailObj = new Mail();
if($_SERVER['REQUEST_METHOD'] !== 'POST') die;
