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

  public function checkSession() {
    if(session_id() == '') $this->message('No session');
    else $this->returnUserData();
  }

  public function getSession($email) {
    if(session_id() == '') session_start();

    $sql = 'SELECT * FROM users WHERE email = ?';
    $stmt = $this->connect()->prepare($sql);
    $stmt->execute([$email]);
    $row = $stmt->fetch();

    $_SESSION['id'] = $row["id"];
    $_SESSION['firstName'] = $row["firstName"];
    $_SESSION['lastName'] = $row["lastName"];
    $_SESSION['email'] = $row["email"];
    $_SESSION['admin'] = $row["admin"];
    $_SESSION['profileImg'] = $row["profileImg"];
    $_SESSION['googleID'] = $row["googleID"];
    $_SESSION['facebookID'] = $row["facebookID"];
    $_SESSION['amazonID'] = $row["amazonID"];
  }

  public function returnUserData() {
    echo '{
      "id": "'.$_SESSION["id"].'",
      "firstName": "'.$_SESSION["firstName"].'",
      "lastName": "'.$_SESSION["lastName"].'",
      "email": "'.$_SESSION["email"].'",
      "admin": '.$_SESSION["admin"].',
      "profileImg": "'.$_SESSION["profileImg"].'",
      "googleID": "'.$_SESSION["googleID"].'",
      "facebookID": "'.$_SESSION["facebookID"].'",
      "amazonID": "'.$_SESSION["amazonID"].'"
    }';
    die;
  }

  public function message($string) {
    echo $string;
    die;
  }
}
