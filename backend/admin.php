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
  public function leagueImport($array) {
    $leagueArray = [];

    for($i = 1; $i < count($array); $i++) {
      for($j = 0; $j < count($array[$i]); $j++)
        array_push($leagueArray, $array[$i][$j]);

      if($this->checkForLeague($leagueArray[0])) $this->insertLeague($leagueArray[0]);

      $leagueArray = [];
    }
  }

  public function checkForLeague($name) {
    $sql = 'SELECT id FROM leagues WHERE LOWER(name) = ?';
    $stmt = $this->connect()->prepare($sql);
    $stmt->execute([$name]);
    $row = $stmt->fetch();
    if(!$row) return true;
    else return false;
  }

  public function insertLeague($name) {
    $sql = 'INSERT INTO leagues(name) VALUES(?)';
    $stmt = $this->connect()->prepare($sql);
    $stmt->execute([$name]);
  }

  public function countryImport($array) {

    $countryArray = [];

    for($i = 1; $i < count($array); $i++) {
      for($j = 0; $j < count($array[$i]); $j++)
        array_push($countryArray, $array[$i][$j]);

      if($this->checkContinents($countryArray[2])) $this->insertContinent($countryArray[2]);
      if($this->checkCountry($countryArray[0],$countryArray[1])) $this->insertCountry($countryArray[0], $countryArray[1], $countryArray[2]);

      $countryArray = [];
    }
  }

  public function checkCountry($name, $code) {
    $sql = 'SELECT id FROM countries WHERE LOWER(name) = ? AND LOWER(code) = ?';
    $stmt = $this->connect()->prepare($sql);
    $stmt->execute([strtolower($name), strtolower($code)]);
    $row = $stmt->fetch();
    if(!$row) return true;
    else return false;
  }

  public function insertCountry($name, $code, $continent) {
    $sql = 'INSERT INTO countries(name, code, continent_id) VALUES(?, ?, (SELECT id FROM continents WHERE LOWER(name) = ?))';
    $stmt = $this->connect()->prepare($sql);
    $stmt->execute([$name, $code, $continent]);
  }

  public function checkContinents($name) {
    $sql = 'SELECT id FROM continents WHERE LOWER(name) = ?';
    $stmt = $this->connect()->prepare($sql);
    $stmt->execute([strtolower($name)]);
    $row = $stmt->fetch();
    if(!$row) return true;
    else return false;
  }

  public function insertContinent($name) {
    $sql = 'INSERT INTO continents(name) VALUES(?)';
    $stmt = $this->connect()->prepare($sql);
    $stmt->execute([$name]);
  }

}

$adminObj = new Admin();
if($_SERVER['REQUEST_METHOD'] !== 'POST') die;
if(isset($_POST['IMPORT_USERS'])) $adminObj->userImport(json_decode($_POST['IMPORT_USERS']));
else if(isset($_POST['IMPORT_LEAGUES'])) $adminObj->leagueImport(json_decode($_POST['IMPORT_LEAGUES']));
else if(isset($_POST['IMPORT_COUNTRIES'])) $adminObj->countryImport(json_decode($_POST['IMPORT_COUNTRIES']));
