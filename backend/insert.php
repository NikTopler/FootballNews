<?php
include_once 'user.php';

class Signin extends User {

  public function standardSignup($userInfo) {
    $this->checkIfUserExists($userInfo[2]);
    $this->errorHandeling($userInfo);
    $this->insert('standard', $userInfo);
  }

  public function googleSignin($userInfo) {
    for($i = 0; $i < count($userInfo); $i++) {
      printf($userInfo[$i]);
    }
  }
  public function facebookSignin($userInfo) {
    for($i = 0; $i < count($userInfo); $i++) {
      printf($userInfo[$i]);
    }
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
    if($string != '') $this->message('Error: '.$string);
    if(!filter_var($userInfo[2], FILTER_VALIDATE_EMAIL)) $this->message('Error: Incorrect email');
    if(preg_match('/\s/', $userInfo[3])) $this->message("Error: No white spaces in password");
  }
}

$signinObj = new Signin();
if($_SERVER['REQUEST_METHOD'] !== 'POST') die;
if(isset($_POST['STANDARD'])) $signinObj->standardSignup(json_decode($_POST['STANDARD']));
else if(isset($_POST['SOCIAL'])) $signinObj->socialSignin(json_decode($_POST['SOCIAL']));
