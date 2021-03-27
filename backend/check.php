<?php
include_once 'user.php';

class Check extends User {

  public function signin($userInfo) {
    $sql = 'SELECT * FROM users WHERE email = ?';
    $stmt = $this->connect()->prepare($sql);
    $stmt->execute([$userInfo[0]]);
    $row = $stmt->fetch();

    if(password_verify($userInfo[1], $row['password'])) echo 'success';
    else echo 'wrong password';
  }

}

$checkObj = new Check();
if($_SERVER['REQUEST_METHOD'] !== 'POST') die;
if(isset($_POST['signin'])) $checkObj->signin(json_decode($_POST['signin']));
