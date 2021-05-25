<?php
include_once 'user.php';

class News extends User {

  public function latestNews($word) {

    $sql = 'SELECT * FROM latest_news ORDER BY time ASC';
    $stmt = $this->connect()->prepare($sql);
    $stmt->execute();
    $row = $stmt->fetch();

    http_response_code(200);
    echo json_encode(array(
      "status" => "ok",
      "data" => $row['news']
    ));
    die;
  }
}

$newsObj = new News();
if($_SERVER['REQUEST_METHOD'] !== 'POST') die;
if(isset($_POST['LATEST_NEWS'])) $newsObj->latestNews($_POST['LATEST_NEWS']);
