<?php
include_once 'user.php';

class News extends User {

  public function homePage() {

    $sql = 'SELECT * FROM news WHERE type = "latest" ORDER BY time DESC';
    $stmt = $this->connect()->prepare($sql);
    $stmt->execute();
    $row = $stmt->fetch();
    $latestNews = $row['data'];

    $sql = 'SELECT * FROM news WHERE league_id = (SELECT id FROM leagues WHERE name = "Laliga") ORDER BY time DESC';
    $stmt = $this->connect()->prepare($sql);
    $stmt->execute();
    $row = $stmt->fetch();
    $laliga = $row['data'];

    $sql = 'SELECT * FROM news WHERE league_id = (SELECT id FROM leagues WHERE name = "Premier League") ORDER BY time DESC';
    $stmt = $this->connect()->prepare($sql);
    $stmt->execute();
    $row = $stmt->fetch();
    $premierLeague = $row['data'];

    $sql = 'SELECT * FROM news WHERE type = "Champions League" ORDER BY time DESC';
    $stmt = $this->connect()->prepare($sql);
    $stmt->execute();
    $row = $stmt->fetch();
    $championsLeague = $row['data'];

    http_response_code(200);
    echo json_encode(array(
      "status" => "ok",
      "latest" => $latestNews,
      "laliga" => $laliga,
      "premier_league" => $premierLeague,
      "champions_league" => $championsLeague
    ));
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

  public function players($data) {

    $sql = 'SELECT * FROM seasons WHERE league_id = (SELECT id FROM leagues WHERE name = ?) AND name = ?';
    $stmt = $this->connect()->prepare($sql);
    $stmt->execute([$data->league, $data->seasonName]);
    $seasonRow = $stmt->fetch();

    $sql = 'SELECT s.id as seasonID, s.league_id as leagueID, s.start as start, s.end as end, i.data as data, i.time as time, s.name as name, i.type as type
            FROM seasons s INNER JOIN season_info i ON s.id = i.season_id
            WHERE s.id = ? AND i.type = "top-scorers"';

    $stmt = $this->connect()->prepare($sql);
    $stmt->execute([$seasonRow["id"]]);
    $row = $stmt->fetch();

    $playersArray = array(
      "seasonID" => $row['seasonID'],
      "name" => $row['name'],
      "time" => $row['time'],
      "type" => $row['type'],
      "data" => $row['data'],
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
        "short_code" => $row['shortCode'],
        "logo" => $row['logo'],
        "team_id" => $row['id']
      ));
    }

    http_response_code(200);

    echo json_encode(array(
      "status" => "ok",
      "teams" => $teamsArray
    ));
  }

  public function team($id) {
    $sql = 'SELECT * FROM teams WHERE id = ?';
    $stmt = $this->connect()->prepare($sql);
    $stmt->execute([$id]);
    $row = $stmt->fetch();

    $teamArray = array(
      "name" => $row['name'],
      "short_code" => $row['shortCode'],
      "logo" => $row['logo']
    );

    http_response_code(200);

    echo json_encode(array(
      "status" => "ok",
      "team" => $teamArray
    ));
  }

  public function standing($data) {
    $sql = 'SELECT i.data as data
            FROM seasons s INNER JOIN season_info i ON s.id = i.season_id
            WHERE s.league_id = (SELECT id FROM leagues WHERE name = ?) AND s.name = ? AND i.type = "standings"';
    $stmt = $this->connect()->prepare($sql);
    $stmt->execute([$data->league, $data->season]);
    $row = $stmt->fetch();

    http_response_code(200);

    echo json_encode(array(
      "status" => "ok",
      "standing" => $row['data']
    ));
  }

  public function allSeasons() {
    $sql = 'SELECT * FROM seasons';
    $stmt = $this->connect()->prepare($sql);
    $stmt->execute();
    $row = $stmt->fetch();
  }

  public function teams() {
    $sql = 'SELECT * FROM teams';
    $stmt = $this->connect()->prepare($sql);
    $stmt->execute();

    $teamsArray = [];

    while($row = $stmt->fetch()) {
      array_push($teamsArray, array(
        "id" => $row['id'],
        "name" => $row['name'],
        "shortCode" => $row['shortCode'],
        "logo" => $row['logo']
      ));
    }

    http_response_code(200);

    echo json_encode(array(
      "status" => "ok",
      "teams" => $teamsArray
    ));
  }
}

$newsObj = new News();
if($_SERVER['REQUEST_METHOD'] !== 'POST') die;
if(isset($_POST['HOME_NEWS'])) $newsObj->homePage();
else if(isset($_POST['SEARCH'])) $newsObj->search($_POST['SEARCH']);
else if(isset($_POST['PLAYERS'])) $newsObj->players(json_decode($_POST['PLAYERS']));
else if(isset($_POST['GET_ALL_TEAMS'])) $newsObj->allTeams();
else if(isset($_POST['GET_TEAM'])) $newsObj->team($_POST['GET_TEAM']);
else if(isset($_POST['GET_STANDING'])) $newsObj->standing(json_decode($_POST['GET_STANDING']));
