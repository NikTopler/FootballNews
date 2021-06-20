<?php
include_once 'user.php';

class News extends User {

  public function homePage() {

    $sql = 'SELECT * FROM news WHERE type = "latest" ORDER BY time DESC';
    $stmt = $this->connect()->prepare($sql);
    $stmt->execute();
    $row = $stmt->fetch();
    $latestNews = $row['news'];

    $sql = 'SELECT * FROM news WHERE type = "laliga" ORDER BY time DESC';
    $stmt = $this->connect()->prepare($sql);
    $stmt->execute();
    $row = $stmt->fetch();
    $laliga = $row['news'];

    $sql = 'SELECT * FROM news WHERE type = "premier league" ORDER BY time DESC';
    $stmt = $this->connect()->prepare($sql);
    $stmt->execute();
    $row = $stmt->fetch();
    $premierLeague = $row['news'];

    $sql = 'SELECT * FROM news WHERE type = "Champions League" ORDER BY time DESC';
    $stmt = $this->connect()->prepare($sql);
    $stmt->execute();
    $row = $stmt->fetch();
    $championsLeague = $row['news'];

    http_response_code(200);
    echo json_encode(array(
      "status" => "ok",
      "latest" => $latestNews,
      "laliga" => $laliga,
      "premier_league" => $premierLeague,
      "champions_league" => $championsLeague
    ));

    die;
  }

  public function search($url) {
    try {
      $search = file_get_contents($url);
      libxml_use_internal_errors(TRUE);
      http_response_code(200);
      echo json_encode(array(
        "status" => "ok",
        "search" => $search
      ));
    } catch(Exception $e) {
      http_response_code(404);
      echo json_encode(array(
        "status" => "not ok",
        "error" => $e
      ));
    }
  }

  public function players($league) {
    $sql = 'SELECT ld.time as time, ld.type as type, ld.data as data, l.name as name
            FROM league_data ld INNER JOIN leagues l ON ld.league_id = l.id
            WHERE ld.league_id = (SELECT id FROM leagues WHERE name = ?)
              AND ld.type = "top-scorers" ORDER BY ld.time ASC LIMIT 1';
    $stmt = $this->connect()->prepare($sql);
    $stmt->execute([$league]);
    $players = $stmt->fetch();

    $playersArray = array(
      "name" => $players['name'],
      "time" => $players['time'],
      "type" => $players['type'],
      "data" => $players['data'],
    );
    http_response_code(200);

    echo json_encode(array(
      "status" => "ok",
      "players" => $playersArray
    ));
  }

  public function allTeams() {
    $sql = 'SELECT * FROM teams';
    $stmt = $this->connect()->prepare($sql);
    $stmt->execute();

    $teamsArray = [];

    while($row = $stmt->fetch()) {
      array_push($teamsArray, array(
        "name" => $row['name'],
        "short_code" => $row['short_code'],
        "logo" => $row['logo'],
        "team_id" => $row['team_id']
      ));
    }

    http_response_code(200);

    echo json_encode(array(
      "status" => "ok",
      "teams" => $teamsArray
    ));
  }

  public function team($id) {
    $sql = 'SELECT * FROM teams WHERE team_id = ?';
    $stmt = $this->connect()->prepare($sql);
    $stmt->execute([$id]);
    $row = $stmt->fetch();

    $teamArray = array(
      "name" => $row['name'],
      "short_code" => $row['short_code'],
      "logo" => $row['logo']
    );

    http_response_code(200);

    echo json_encode(array(
      "status" => "ok",
      "team" => $teamArray
    ));
  }

  public function standing($league) {
    $sql = 'SELECT * FROM league_data WHERE type = ? ORDER BY id ASC;';
    $stmt = $this->connect()->prepare($sql);
    $stmt->execute([$league.'_standings']);
    $row = $stmt->fetch();

    http_response_code(200);

    echo json_encode(array(
      "status" => "ok",
      "standing" => $row['data']
    ));
  }

}

$newsObj = new News();
if($_SERVER['REQUEST_METHOD'] !== 'POST') die;
if(isset($_POST['HOME_NEWS'])) $newsObj->homePage();
else if(isset($_POST['SEARCH'])) $newsObj->search($_POST['SEARCH']);
else if(isset($_POST['PLAYERS'])) $newsObj->players($_POST['PLAYERS']);
else if(isset($_POST['GET_ALL_TEAM'])) $newsObj->allTeams();
else if(isset($_POST['GET_TEAM'])) $newsObj->team($_POST['GET_TEAM']);
else if(isset($_POST['GET_STANDING'])) $newsObj->standing($_POST['GET_STANDING']);
