<?php
include_once 'user.php';

class Signin extends User {

  public function socialSignin($userInfo) {
    $userExists = $this->checkIfUserExists($userInfo->provider, $userInfo->email, $userInfo->id);

    if($userExists == 0) $this->insertSignin($userInfo);
    else if ($userExists == 2) $this->updateSocialId($userInfo->provider, $userInfo->email, $userInfo->id);

    $userData = $this->getuserData('email', $userInfo->email);
    $res = $this->generateTokens($userData);
    $this->updateRefreshTokenDb($userInfo->email, json_decode($res)->refreshToken);

    echo $res;
  }

  public function updateRefreshTokenDb($email, $token) {
    $sql = 'UPDATE users SET refreshToken = ? WHERE email = ?';
    $stmt = $this->connect()->prepare($sql);
    $stmt->execute([$token, $email]);
  }

  public function insertSignin($userInfo) {
    $date = date(time());
    $defaultProfileImage = null;

    if($userInfo->provider == 'GOOGLE') {
      $dbName = 'googleID';
      $array = [$userInfo->firstName, $userInfo->lastName, $userInfo->email, password_hash($userInfo->id, PASSWORD_DEFAULT), $date, $userInfo->photoUrl];
    } else if($userInfo->provider == 'FACEBOOK') {
      $dbName = 'facebookID';
      $array = [$userInfo->firstName, $userInfo->lastName, $userInfo->email, password_hash($userInfo->id, PASSWORD_DEFAULT), $date, $userInfo->photoUrl];
    } else if($userInfo->provider == 'AMAZON') {
      $dbName = 'amazonID';
      $array = [$userInfo->firstName, $userInfo->lastName, $userInfo->email, password_hash($userInfo->id, PASSWORD_DEFAULT), $date, $defaultProfileImage];
    }
    $sql = 'INSERT INTO users(firstName, lastName, email, '.$dbName.', createdAt, profileImg) VALUES(?,?,?,?,?,?)';
    $stmt = $this->connect()->prepare($sql);
    $stmt->execute($array);

    $sql = 'INSERT INTO settings(user_id) VALUES((SELECT id FROM users WHERE email = ?))';
    $stmt = $this->connect()->prepare($sql);
    $stmt->execute([$userInfo->email]);
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
}

$signinObj = new Signin();
if($_SERVER['REQUEST_METHOD'] !== 'POST') die;
if(isset($_POST['SOCIAL'])) $signinObj->socialSignin(json_decode($_POST['SOCIAL']));
