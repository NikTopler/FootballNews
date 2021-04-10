<?php
include_once 'user.php';

class Admin extends User {

  public function userImport($array) {

    $userArray = [];

    for($i = 1; $i < count($array); $i++) {
      for($j = 0; $j < count($array[$i]); $j++)
        array_push($userArray, $array[$i][$j]);

      if($this->checkForUser($userArray[2])) $this->insertUser($userArray);
      $userArray = [];
    }
  }

  public function checkForUser($email) {
    $sql = 'SELECT * FROM users WHERE email = ?';
    $stmt = $this->connect()->prepare($sql);
    $stmt->execute([$email]);
    $row = $stmt->fetch();
    if(!$row) return true;
    else return false;
  }

  public function insertUser($userInfo) {
    $date = date(time());

    $admin = 0;
    if(strtolower($userInfo[3]) == 'TRUE') $admin = 1;

    $array = [$userInfo[0], $userInfo[1], $userInfo[2], $admin, $date, $userInfo[4]];

    $sql = 'INSERT INTO users(firstName, lastName, email, admin, createdAt, profileImg) VALUES(?,?,?,?,?,?)';
    $stmt = $this->connect()->prepare($sql);
    $stmt->execute($array);
  }
}

$adminObj = new Admin();
if($_SERVER['REQUEST_METHOD'] !== 'POST') die;
if(isset($_POST['IMPORT_USERS'])) $adminObj->userImport(json_decode($_POST['IMPORT_USERS']));

