<?php
include_once '../user.php';

class LatestNews extends User {

  public function news() {
    $date = date(time());

    include '../config/core.php';

    $data = file_get_contents('https://newsapi.org/v2/everything?q=soccer&apiKey='.$newsApiKey);
    libxml_use_internal_errors(TRUE);

    if(empty($data)) die;

    $sql = 'INSERT INTO latest_news(news, time) VALUES(?,?)';
    $stmt = $this->connect()->prepare($sql);
    $stmt->execute([$data, $date]);
  }
}

$latestObj = new LatestNews();
$latestObj->news();
