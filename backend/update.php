<?php
include_once 'user.php';

class Update extends User {

  public function getAllUsers($data) {

    $sql = 'SELECT * FROM users ORDER BY id LIMIT '.$data->start.', '.$data->end;
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

    $sql = 'SELECT t.name AS teamName,
            t.team_id, t.short_code, t.logo,
            c.name AS countryName,
            co.name AS continentName, l.name AS leagueName, lt.startDate, lt.endDate FROM teams t
            INNER JOIN league_team lt ON lt.team_id = t.id
              INNER JOIN leagues l ON lt.league_id = l.id
              INNER JOIN countries c ON t.country_id = c.id
              INNER JOIN continents co ON c.continent_id = co.id
            ORDER BY t.id LIMIT '.$data->start.', '.$data->end;
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

    $sql = 'SELECT * FROM leagues ORDER BY id LIMIT '.$data->start.', '.$data->end;
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
      "data" => $allLeagues,
      "hello" =>  $sql
    ));
  }

}

$updateObj = new Update();
if($_SERVER['REQUEST_METHOD'] !== 'POST') die;
if(isset($_POST['GET_USERS'])) $updateObj->getAllUsers(json_decode($_POST['GET_USERS']));
else if(isset($_POST['GET_TEAMS'])) $updateObj->getAllTeams(json_decode($_POST['GET_TEAMS']));
else if(isset($_POST['GET_LEAGUES'])) $updateObj->getAllLeagues(json_decode($_POST['GET_LEAGUES']));
