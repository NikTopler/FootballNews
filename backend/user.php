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

  public function getSession($email) {
    if(session_id() == '') session_start();

    $sql = 'SELECT * FROM users WHERE email = ?';
    $stmt = $this->connect()->prepare($sql);
    $stmt->execute([$email]);
    $row = $stmt->fetch();

    echo '{
      "id": "'.$row["id"].'",
      "firstName": "'.$row["firstName"].'",
      "lastName": "'.$row["lastName"].'",
      "email": "'.$row["email"].'",
      "admin": '.$row["admin"].',
      "profileImg": "'.$row["profileImg"].'",
      "googleID": "'.$row["googleID"].'",
      "facebookID": "'.$row["facebookID"].'",
      "amazonID": "'.$row["amazonID"].'"
    }';
    die;
  }

  public function message($string) {
    echo $string;
    die;
  }
}
