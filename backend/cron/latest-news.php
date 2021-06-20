<?php
include_once '../config/db.php';

class LatestNewsCRON extends Dbh {

  public function news() {
    $date = date(time());

    include '../config/core.php';

    $latest = file_get_contents('https://newsapi.org/v2/everything?q=soccer&apiKey='.$newsApiKey);
    $laliga = file_get_contents('https://newsapi.org/v2/everything?q=laliga&apiKey='.$newsApiKey);
    $premierLeague = file_get_contents('https://newsapi.org/v2/everything?q=premier+league&apiKey='.$newsApiKey);
    $championsLeague = file_get_contents('https://newsapi.org/v2/everything?q=champions+league&apiKey='.$newsApiKey);

    libxml_use_internal_errors(TRUE);

    $this->insert($latest, $date, 'latest');
    $this->insert($laliga, $date, 'laliga');
    $this->insert($premierLeague, $date, 'premier league');
    $this->insert($championsLeague, $date, 'Champions League');
  }

  private function insert($news, $date, $type) {
    $sql = 'INSERT INTO news(news, time, type) VALUES(?,?,?)';
    $stmt = $this->connect()->prepare($sql);
    $stmt->execute([$news, $date, $type]);
  }
}

$latestObj = new LatestNewsCRON();
$latestObj->news();
