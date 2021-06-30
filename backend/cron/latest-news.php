<?php include_once '../config/db.php';

class LatestNewsCRON extends Dbh {

  public function news() {
    $date = date(time());

    include '../config/core.php';

    $latest = file_get_contents('https://newsapi.org/v2/everything?q=soccer&apiKey='.$newsApiKey);
    $laliga = file_get_contents('https://newsapi.org/v2/everything?q=laliga&apiKey='.$newsApiKey);
    $premierLeague = file_get_contents('https://newsapi.org/v2/everything?q=premier+league&apiKey='.$newsApiKey);
    $championsLeague = file_get_contents('https://newsapi.org/v2/everything?q=champions+league&apiKey='.$newsApiKey);

    libxml_use_internal_errors(TRUE);

    $this->insert($latest, $date, null, 'latest');
    $this->insert($laliga, $date, 'Laliga', null);
    $this->insert($premierLeague, $date, 'Premier League', null);
    $this->insert($championsLeague, $date, null, 'Champions League');
  }

  private function insert($data, $time, $league, $type) {
    $sql = 'INSERT INTO news(league_id, time, type, data) VALUES((SELECT id FROM leagues WHERE name = ?),?,?,?)';
    $stmt = $this->connect()->prepare($sql);
    $stmt->execute([$league, $time, $type, $data]);
  }
}

$latestObj = new LatestNewsCRON();
$latestObj->news();
