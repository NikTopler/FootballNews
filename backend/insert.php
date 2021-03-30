<?php
include_once 'user.php';

class Signin extends User {

  public function standardSignup($userInfo) {
    $this->errorHandeling($userInfo);
    $userExists = $this->checkIfUserExists('STANDARD', $userInfo[2], null);
    if($userExists == 0) $this->insertSignin('STANDARD', $userInfo);
    else if($userExists == 1 || $userExists == 2) $this->message('Error: Something went wrong');
    else if($userExists == 3) $this->message('Error: Already exists');
  }

  public function socialSignin($userInfo) {
    $userExists = $this->checkIfUserExists($userInfo[5], $userInfo[3], $userInfo[0]);
    if($userExists == 0) $this->insertSignin($userInfo[5], $userInfo);
    else if($userExists == 1) $this->message('Success');
    else if ($userExists == 2) $this->updateSocialId($userInfo[5], $userInfo[3], $userInfo[0]);
    else if ($userInfo == 3) $this->message('Error: Something went wrong');
  }

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
