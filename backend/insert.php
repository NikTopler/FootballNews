<?php
include_once 'user.php';

class Signin extends User {

  // Not in use
  public function standardSignup($userInfo) {
    // $this->errorHandeling($userInfo);
    // $userExists = $this->checkIfUserExists('STANDARD', $userInfo[2], null);
    // if($userExists == 0) $this->insertSignin('STANDARD', $userInfo);
    // else if($userExists == 1 || $userExists == 2) $this->message('Error: Something went wrong');
    // else if($userExists == 3) $this->message('Error: Already exists');
  }

  public function socialSignin($userInfo) {
    $userExists = $this->checkIfUserExists($userInfo[5], $userInfo[3], $userInfo[0]);

    if($userExists == 0) $this->insertSignin($userInfo[5], $userInfo);
    else if ($userExists == 2) $this->updateSocialId($userInfo[5], $userInfo[3], $userInfo[0]);
    else if ($userInfo == 3) $this->message('Error: Something went wrong');

    $userData = $this->getuserData($userInfo[3]);
    $res = $this->generateTokens($userData);
    $this->updateRefreshTokenDb($userInfo[3], json_decode($res)->refreshToken);

    echo $res;
  }

  public function updateRefreshTokenDb($email, $token) {
    $sql = 'UPDATE users SET refreshToken = ? WHERE email = ?';
    $stmt = $this->connect()->prepare($sql);
    $stmt->execute([$token, $email]);
  }

  public function insertSignin($type, $userInfo) {
    $date = date(time());
    $defaultProfileImage = '<svg width="64" height="64" viewBox="-4 -4 32 32" fill="#fff" class="rounded-full bg-gray-400 "><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"></path></svg>';
    if($type == 'STANDARD') {
      $dbName = 'password';
      $array = [$userInfo[0], $userInfo[1], $userInfo[2], password_hash($userInfo[3], PASSWORD_DEFAULT), $date, $defaultProfileImage];
    } else if($type == 'GOOGLE') {
      $dbName = 'googleID';
      $array = [$userInfo[1], $userInfo[2], $userInfo[3], password_hash($userInfo[0], PASSWORD_DEFAULT), $date, $userInfo[4]];
    } else if($type == 'FACEBOOK') {
      $dbName = 'facebookID';
      $array = [$userInfo[1], $userInfo[2], $userInfo[3], password_hash($userInfo[0], PASSWORD_DEFAULT), $date, $userInfo[4]];
    } else if($type == 'AMAZON') {
      $dbName = 'amazonID';
      $array = [$userInfo[1], $userInfo[2], $userInfo[3], password_hash($userInfo[0], PASSWORD_DEFAULT), $date, $defaultProfileImage];
    }
    $sql = 'INSERT INTO users(firstName, lastName, email, '.$dbName.', createdAt, profileImg) VALUES(?,?,?,?,?,?)';
    $stmt = $this->connect()->prepare($sql);
    $stmt->execute($array);
  }

  public function updateSocialId($type, $email, $id) {
    if($type == 'GOOGLE') $type = 'googleID';
    else if($type == 'FACEBOOK') $type = 'facebookID';
    else if($type == 'AMAZON') $type = 'amazonID';

    $hashID = password_hash($id, PASSWORD_DEFAULT);
    $array = [$hashID, $email];

    $sql = 'UPDATE users SET '.$type.'= ? WHERE email = ?';
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
