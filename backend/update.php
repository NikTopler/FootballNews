<?php
include_once 'user.php';

class Update extends User {

  public function getAllUsers($data) {

    if($data->start != false) $limit = 'LIMIT '.$data->start.', '.$data->end;
    else $limit = '';

    $sql = 'SELECT * FROM users ORDER BY id '.$limit;
    $stmt = $this->connect()->prepare($sql);
    $stmt->execute();

    $allUsers = [];

    while($row = $stmt->fetch()) {
      array_push($allUsers, [
        $row['firstName'],
        $row['lastName'],
        $row['email'],
        $row['admin'],
        $row['createdAt'],
        $row['updatedAt'],
        $row['profileImg'],
        $row['googleID'],
        $row['facebookID'],
        $row['amazonID'],
        $row['safeImport'],
        $row['editImport']
      ]);
    }

    echo json_encode(array(
      "status" => "ok",
      "data" => $allUsers
    ));
  }

  public function getAllTeams($data) {

    if($data->start != false) $limit = 'LIMIT '.$data->start.', '.$data->end;
    else $limit = '';

    $sql = 'SELECT t.name AS teamName,
            t.team_id, t.short_code, t.logo,
            c.name AS countryName,
            co.name AS continentName, l.name AS leagueName, lt.startDate, lt.endDate FROM teams t
            INNER JOIN league_team lt ON lt.team_id = t.id
              INNER JOIN leagues l ON lt.league_id = l.id
              INNER JOIN countries c ON t.country_id = c.id
              INNER JOIN continents co ON c.continent_id = co.id
            ORDER BY t.id '.$limit;
    $stmt = $this->connect()->prepare($sql);
    $stmt->execute();

    $allTeams = [];

    while($row = $stmt->fetch()) {
      array_push($allTeams, [
        $row['teamName'],
        $row['team_id'],
        $row['short_code'],
        $row['logo'],
        $row['countryName'],
        $row['continentName'],
        $row['leagueName'],
        $row['startDate'],
        $row['endDate']
      ]);
    }

    echo json_encode(array(
      "status" => "ok",
      "data" => $allTeams
    ));
  }

  public function getAllLeagues($data) {

    if($data->start != false) $limit = 'LIMIT '.$data->start.', '.$data->end;
    else $limit = '';

    $sql = 'SELECT * FROM leagues ORDER BY id '.$limit;
    $stmt = $this->connect()->prepare($sql);
    $stmt->execute();

    $allLeagues = [];

    while($row = $stmt->fetch()) {
      array_push($allLeagues, [
        $row['name']
      ]);
    }

    echo json_encode(array(
      "status" => "ok",
      "data" => $allLeagues
    ));
  }

  public function getAllCountries($data) {

    if($data->start != false) $limit = 'LIMIT '.$data->start.', '.$data->end;
    else $limit = '';

    $sql = 'SELECT c.name
              AS countryName,
              c.code AS code,
              co.name AS continentName
            FROM countries c
              INNER JOIN continents co ON c.continent_id = co.id
            ORDER BY c.id '.$limit;
    $stmt = $this->connect()->prepare($sql);
    $stmt->execute();

    $allCountries = [];

    while($row = $stmt->fetch()) {
      array_push($allCountries, [
        $row['countryName'],
        $row['code'],
        $row['continentName']
      ]);
    }

    echo json_encode(array(
      "status" => "ok",
      "data" => $allCountries
    ));
  }

  public function count($type) {
    $sql = 'SELECT * FROM '.$type;
    $stmt = $this->connect()->prepare($sql);
    $stmt->execute();
    $count = $stmt->rowCount();
    echo $count;
  }

  public function emailingSubscription($data) {
    $sql = 'UPDATE settings SET emailingService = ? WHERE user_id = (SELECT id FROM users WHERE email = ?)';
    $stmt = $this->connect()->prepare($sql);
    $stmt->execute([$data->subscription, $data->email]);
  }

  public function getWhoUserFollows($data) {
    $sql = 'SELECT l.name AS leagueName
            FROM follows f
            INNER JOIN users u ON f.user_id = u.id
            INNER JOIN leagues l ON f.league_id = l.id
            WHERE u.email = ?';
    $stmt = $this->connect()->prepare($sql);
    $stmt->execute([$data->email]);

    $leagueArray = [];

    while($row = $stmt->fetch())
      array_push($leagueArray, $row['leagueName']);

    echo json_encode(array(
      "status" => "ok",
      "leagues" => $leagueArray
    ));
  }

  public function followLeague($data) {

    $sql = 'SELECT id FROM follows WHERE user_id = (SELECT id FROM users WHERE email = ?) AND league_id = (SELECT id FROM leagues WHERE name = ?) ';
    $stmt = $this->connect()->prepare($sql);
    $stmt->execute([$data->email, $data->leagueName]);

    $row = $stmt->fetch();

    if($row) die;

    $date = date(time());
    $sql = 'INSERT INTO follows(user_id, league_id, time) VALUES ((SELECT id FROM users WHERE email = ?), (SELECT id FROM leagues WHERE name = ?), ?)';
    $stmt = $this->connect()->prepare($sql);
    $stmt->execute([$data->email, $data->leagueName, $date]);
  }

  public function unFollowLeague($data) {
    $sql = 'DELETE FROM follows WHERE user_id = (SELECT id FROM users WHERE email = ?) AND league_id = (SELECT id FROM leagues WHERE name = ?)';
    $stmt = $this->connect()->prepare($sql);
    $stmt->execute([$data->email, $data->leagueName]);
  }
}

$updateObj = new Update();
if($_SERVER['REQUEST_METHOD'] !== 'POST') die;
if(isset($_POST['GET_USERS'])) $updateObj->getAllUsers(json_decode($_POST['GET_USERS']));
else if(isset($_POST['GET_TEAMS'])) $updateObj->getAllTeams(json_decode($_POST['GET_TEAMS']));
else if(isset($_POST['GET_LEAGUES'])) $updateObj->getAllLeagues(json_decode($_POST['GET_LEAGUES']));
else if(isset($_POST['GET_COUNTRIES'])) $updateObj->getAllCountries(json_decode($_POST['GET_COUNTRIES']));
else if(isset($_POST['COUNT'])) $updateObj->count($_POST['COUNT']);
else if(isset($_POST['EMAIL_SUBSCRIPTION'])) $updateObj->emailingSubscription(json_decode($_POST['EMAIL_SUBSCRIPTION']));
else if(isset($_POST['GET_USER_FOLLOWS'])) $updateObj->getWhoUserFollows(json_decode($_POST['GET_USER_FOLLOWS']));
else if(isset($_POST['FOLLOW_LEAGUE'])) $updateObj->followLeague(json_decode($_POST['FOLLOW_LEAGUE']));
else if(isset($_POST['UNFOLLOW_LEAGUE'])) $updateObj->unFollowLeague(json_decode($_POST['UNFOLLOW_LEAGUE']));
