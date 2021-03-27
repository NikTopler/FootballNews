<?php
include_once 'user.php';

class Check extends User {

  public function signin($userInfo) {
    echo $userInfo[0];
  }

}

$checkObj = new Check();
if($_SERVER['REQUEST_METHOD'] !== 'POST') die;
if(isset($_POST['signin'])) $checkObj->signin(json_decode($_POST['signin']));
