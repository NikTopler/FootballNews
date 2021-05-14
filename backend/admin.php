<?php
include_once 'user.php';

class Admin extends User {

  public function adminCheckUp($adminEmail, $value, $actionType, $type, $columnName, $seasonId) {
    $date = date(time());

    if($type == 'user') $sqlSelect = '(SELECT id FROM users WHERE email = ?)';
    else if($type == 'team') $sqlSelect = '(SELECT id FROM teams WHERE team_id = ?)';
    else if($type == 'league') $sqlSelect = '(SELECT id FROM leagues WHERE LOWER(name) = ?)';
    else if($type == 'country') $sqlSelect = '(SELECT id FROM countries WHERE LOWER(name) = ?)';
    else if($type == 'season') $sqlSelect = $seasonId;
    else if($type == 'email') $sqlSelect = '(SELECT id FROM sendEmails WHERE time = ?)';

    $sql = 'INSERT INTO
      track_admin(time, admin_id, type, '.$columnName.')
      VALUES (?, (SELECT id FROM users WHERE email = ?), ?, '.$sqlSelect.')';
    $stmt = $this->connect()->prepare($sql);
    $stmt->execute([$date, $adminEmail, $actionType, $value]);
  }

  public function userImport($data) {

    $email = $data->email;
    $array = $data->array;

    $userArray = [];

    for($i = 1; $i < count($array); $i++) {
      for($j = 0; $j < count($array[$i]); $j++)
        array_push($userArray, $array[$i][$j]);

      if($this->checkForUser($userArray[2])) {
        $this->insertUser($userArray);
        $this->adminCheckUp($email, $userArray[2], 'import', 'user', 'user_import_id', null);
      }
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

    if(strtolower($userInfo[3]) == 'true' || $userInfo[3] == '1') $admin = 1;
    else $admin = 0;

    $array = [$userInfo[0], $userInfo[1], $userInfo[2], $admin, $date, $userInfo[4]];

    $sql = 'INSERT INTO users(firstName, lastName, email, admin, createdAt, profileImg) VALUES(?,?,?,?,?,?)';
    $stmt = $this->connect()->prepare($sql);
    $stmt->execute($array);
  }

  public function teamImport($data) {

    $email = $data->email;
    $array = $data->array;

    $teamArray = [];

    for($i = 1; $i < count($array); $i++) {
      for($j = 0; $j < count($array[$i]); $j++)
        array_push($teamArray, $array[$i][$j]);

      $teamName = $teamArray[0];
      $teamId = $teamArray[1];
      $shortCode = $teamArray[2];
      $logo = $teamArray[3];
      $countryName = $teamArray[4];
      $continentName = $teamArray[5];
      $leagueName = $teamArray[6];
      $seasonStart = $teamArray[7];
      $seasonEnd = $teamArray[8];

      if($this->checkContinents($continentName)) $this->insertContinent($continentName);
      if($this->checkCountry($countryName, NULL)) {
        $this->insertCountry($countryName, NULL, $continentName);
        $this->adminCheckUp($email, $countryName, 'import', 'country', 'country_import_id', null);
      }

      if($this->checkLeagues($leagueName, $countryName)) {
        $this->insertLeague($leagueName);
        $this->adminCheckUp($email, $leagueName, 'import', 'league', 'league_import_id', null);
      }

      if($this->checkTeam($teamId)) {
        $this->insertTeam($teamName, $teamId, $shortCode, $logo, $countryName);
        $this->adminCheckUp($email, $teamId, 'import', 'team', 'team_import_id', null);
      }

      if($this->checkSeason($seasonStart, $seasonEnd, $teamId, $leagueName, false)) {
        $this->insertSeason($seasonStart, $seasonEnd, $teamId, $leagueName);
        $this->adminCheckUp($email, $teamId, 'import', 'season', 'season_import_id', $this->checkSeason($seasonStart, $seasonEnd, $teamId, $leagueName, true));
      }
      $teamArray = [];
    }
  }

  public function insertLeague($leagueName) {
    $sql = 'INSERT INTO leagues(name) VALUES(?)';
    $stmt = $this->connect()->prepare($sql);
    $stmt->execute([$leagueName]);
  }

  public function checkLeagues($leagueName) {
    $sql = 'SELECT id FROM leagues WHERE LOWER(name) = ?';
    $stmt = $this->connect()->prepare($sql);
    $stmt->execute([strtolower($leagueName)]);
    $row = $stmt->fetch();

    if(!$row) return true;
    return false;
  }

  public function checkSeason($startDate, $endDate, $team_id, $leagueName, $returnId) {
    $sql = 'SELECT id
    FROM league_team
    WHERE startDate = ?
      AND endDate = ?
      AND team_id = (SELECT id FROM teams WHERE team_id = ?)
      AND league_id = (SELECT id FROM leagues WHERE LOWER(name) = ?)';

    $stmt = $this->connect()->prepare($sql);
    $stmt->execute([$startDate, $endDate, $team_id, strtolower($leagueName)]);
    $row = $stmt->fetch();

    if($returnId) return $row['id'];

    if(!$row) return true;
    return false;
  }

  public function insertSeason($startDate, $endDate, $team_id, $leagueName) {
    $sql = 'INSERT INTO league_team(startDate, endDate, team_id, league_id)
    VALUES(?, ?,
      (SELECT id FROM teams WHERE team_id = ?),
      (SELECT id FROM leagues WHERE LOWER(name) = ?))';
    $stmt = $this->connect()->prepare($sql);
    $stmt->execute([$startDate, $endDate, (int)$team_id, strtolower($leagueName)]);
  }

  public function checkTeam($team_id) {
    $sql = 'SELECT id FROM teams WHERE team_id = ?';
    $stmt = $this->connect()->prepare($sql);
    $stmt->execute([$team_id]);
    $row = $stmt->fetch();

    if(!$row) return true;
    else return false;
  }

  public function insertTeam($teamName, $team_id, $short_code, $logo, $countryName) {
    $sql = 'INSERT INTO teams(name, team_id, short_code, logo, country_id)
    VALUES(?, ?, ?, ?, (SELECT id FROM countries WHERE LOWER(name) = ?))';
    $stmt = $this->connect()->prepare($sql);
    $stmt->execute([$teamName, (int)$team_id, $short_code, $logo, strtolower($countryName)]);
  }

  public function leagueImport($data) {

    $email = $data->email;
    $array = $data->array;

    $leagueArray = [];

    for($i = 1; $i < count($array); $i++) {
      for($j = 0; $j < count($array[$i]); $j++)
        array_push($leagueArray, $array[$i][$j]);

      if($this->checkForLeague($leagueArray[0])) {
        $this->insertLeague($leagueArray[0]);
        $this->adminCheckUp($email, $leagueArray[0], 'import', 'league', 'league_import_id', null);
      }

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

  public function countryImport($data) {

    $email = $data->email;
    $array = $data->array;

    $countryArray = [];

    for($i = 1; $i < count($array); $i++) {
      for($j = 0; $j < count($array[$i]); $j++)
        array_push($countryArray, $array[$i][$j]);

      if($this->checkContinents($countryArray[2])) $this->insertContinent($countryArray[2]);
      if($this->checkCountry($countryArray[0],$countryArray[1])) {
        $this->insertCountry($countryArray[0], $countryArray[1], $countryArray[2]);
        $this->adminCheckUp($email, $countryArray[0], 'import', 'country', 'country_import_id', null);
      }

      $countryArray = [];
    }
  }

  public function checkCountry($name, $code) {
    $sql = 'SELECT id FROM countries WHERE LOWER(name) = ? OR LOWER(code) = ?';
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
if(isset($_POST['USERS'])) $adminObj->userImport(json_decode($_POST['USERS']));
else if(isset($_POST['TEAMS'])) $adminObj->teamImport(json_decode($_POST['TEAMS']));
else if(isset($_POST['LEAGUES'])) $adminObj->leagueImport(json_decode($_POST['LEAGUES']));
else if(isset($_POST['COUNTRIES'])) $adminObj->countryImport(json_decode($_POST['COUNTRIES']));
