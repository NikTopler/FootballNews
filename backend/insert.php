<?php
include_once 'user.php';

class Signin extends User {

  public function standardSignup($userInfo) {
    for($i = 0; $i < count($userInfo); $i++) {
        echo $userInfo[$i];
    }
  }

  public function checkIfUserExists($email) {
      $sql = 'SELECT * FROM users WHERE email = ?';
      $stmt = $this->connect()->prepare($sql);
      $stmt->execute([$email]);
      $row = $stmt->fetch();
  public function errorOver($string) {
    echo $string;
    die;
  }
}

$signinObj = new Signin();
if(isset($_POST['standard'])) $signinObj->standardSignup(json_decode($_POST['standard']));
