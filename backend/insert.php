<?php
include_once 'user.php';

class Signin extends User {

  public function standardSignup($userInfo) {
    $this->checkIfUserExists($userInfo[2]);
    $this->errorHandeling($userInfo);
    $this->insert('standard', $userInfo);
  }

  public function checkIfUserExists($email) {
      $sql = 'SELECT * FROM users WHERE email = ?';
      $stmt = $this->connect()->prepare($sql);
      $stmt->execute([$email]);
      $row = $stmt->fetch();
      if($row) $this->errorOver('user is in db');
  }

  public function insert($type, $userInfo) {
    $date = date(time());
    if($type == 'standard') {
      $hashPassword = password_hash($userInfo[3], PASSWORD_DEFAULT);
      $sql = 'INSERT INTO users(firstName, lastName, email, password, createdAt) VALUES(?,?,?,?,?)';
      $array = [$userInfo[0], $userInfo[1], $userInfo[2], $hashPassword, $date];
    }
    $stmt = $this->connect()->prepare($sql);
    $stmt->execute($array);
  }

  public function errorHandeling($userInfo) {
    $string = '';
    if(empty($userInfo[0])) $string = $string.' name';
    if(empty($userInfo[1])) $string = $string.' surname';
    if(empty($userInfo[2])) $string = $string.' email';
    if(empty($userInfo[3])) $string = $string.' password';
    if(empty($userInfo[4])) $string = $string.' password-repeat';
    if($string != '') $this->errorOver($string);
    if(!filter_var($userInfo[2], FILTER_VALIDATE_EMAIL)) $this->errorOver('incorrect email');
    if(preg_match('/\s/', $userInfo[3])) $this->errorOver("no white spaces in password");
  }

  public function errorOver($string) {
    echo $string;
    die;
  }
}

$signinObj = new Signin();
if($_SERVER['REQUEST_METHOD'] !== 'POST') die;
if(isset($_POST['standard'])) $signinObj->standardSignup(json_decode($_POST['standard']));
