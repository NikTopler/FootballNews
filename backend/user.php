<?php
include_once 'db.php';

$allowed_domains = ["http://localhost:4200", "https://footballnews-app.herokuapp.com"];

if (in_array($_SERVER['HTTP_ORIGIN'], $allowed_domains)) header("Access-Control-Allow-Origin: " . $_SERVER['HTTP_ORIGIN']);
else {
    echo 'Access denied';
    die;
}

class User extends Dbh {

  public function checkIfUserExists($type, $email, $id) {
    $sql = 'SELECT * FROM users WHERE email = ?';
    $stmt = $this->connect()->prepare($sql);
    $stmt->execute([$email]);
    $row = $stmt->fetch();

    if(!$row) return 0;
    if($type == 'STANDARD') return 3;
    else if($type == 'GOOGLE') $dbName = 'googleID';
    else if($type == 'FACEBOOK') $dbName = 'facebookID';
    else if($type == 'AMAZON') $dbName = 'amazonID';

    if(password_verify($id, $row[$dbName])) return 1;
    else return 2;
  }

  public function message($string) {
    echo $string;
    die;
  }
}
