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
}

$newsObj = new News();
if($_SERVER['REQUEST_METHOD'] !== 'POST') die;
if(isset($_POST['HOME_NEWS'])) $newsObj->homePage();
