<?php
include_once 'user.php';

class Update extends User {
}

$updateObj = new Update();
if($_SERVER['REQUEST_METHOD'] !== 'POST') die;
