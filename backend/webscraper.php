<?php
include_once 'user.php';

class WebScraper extends User {
  public $website = 'https://www.google.com/search?tbm=isch&q=';
  public $images = array();

  public function setup($website) {
    $html = file_get_contents($website);
    $news_doc = new DOMDocument();

    libxml_use_internal_errors(TRUE);

    if(empty($html)) die;

    $news_doc->loadHTML($html);
    libxml_clear_errors();

    return new DOMXPath($news_doc);
  }

  public function googleImage($query) {
    $website = $this->website.$query;
    $xpath = $this->setup($website);

    $images = $xpath->query('//img');
    foreach($images as $row) {
      $link = $row->getAttribute('src');
      if(strpos($link, '.gif') == false)
        return $link;
    }
  }

  public function insertImages($players) {
    die;
    $array = [];
    $date = date(time());

    for($i = 0; $i < 25; $i++) {
      $image = $this->googleImage($players[$i]->name);
      array_push($array, $image);
    }
    $obj = json_encode(array("premier_league" => $array));
    $sql = 'INSERT INTO league_data(time, league_id, type, data) VALUES(?, ?, ?, ?)';
    $stmt = $this->connect()->prepare($sql);
    $stmt->execute([$date, 6, 'premier_league__player_images', $obj]);
  }

  public function getPlayerImages($league) {
    $sql = 'SELECT * FROM league_data WHERE type = ? ORDER BY time ASC';
    $stmt = $this->connect()->prepare($sql);
    $stmt->execute([$league.'_player_images']);
    $row = $stmt->fetch();

    http_response_code(200);
    echo json_encode(array(
      "status" => "ok",
      "league" => $row['data']
    ));
  }
}

$webScraperObj = new WebScraper();
if(isset($_POST['GOOGLE_IMAGE'])) $webScraperObj->getPlayerImages($_POST['GOOGLE_IMAGE']);

