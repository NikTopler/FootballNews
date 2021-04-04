<?php
include_once 'config/db.php';
require __DIR__ . '/libs/vendor/autoload.php';
use \Firebase\JWT\JWT;

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

  public function getUserData($email) {

    $sql = 'SELECT * FROM users WHERE email = ?';
    $stmt = $this->connect()->prepare($sql);
    $stmt->execute([$email]);
    $row = $stmt->fetch();
    return [
      $row['id'],
      $row['firstName'],
      $row['lastName'],
      $row['email'],
      $row['admin'],
      $row['createdAt'],
      $row['updatedAt'],
      $row['profileImg'],
      $row['googleID'],
      $row['facebookID'],
      $row['amazonID'],
      $row['refreshToken']
    ];
  }

  public function generateTokens($userInfo) {

    $data = array(
      "id" => $userInfo[0],
      "firstName" => $userInfo[1],
      "lastName" => $userInfo[2],
      "email" => $userInfo[3],
      "admin" => $userInfo[4],
      "createdAt" => $userInfo[5],
      "updatedAt" => $userInfo[6],
      "profileImg" => $userInfo[7],
      "googleID" => $userInfo[8],
      "facebookID" => $userInfo[9],
      "amazonID" => $userInfo[10]
    );

    $jwtAccessToken = $this->generateAccessToken($userInfo);
    $jwtRefreshToken = $this->generateRefreshToken($userInfo[0]);

    http_response_code(200);

    return json_encode(array(
      "status" => "ok",
      "jwt" => $jwtAccessToken,
      "refreshToken" => $jwtRefreshToken,
      "id" => $userInfo[0],
      "data" => $data,
      "message" => "User session has started"
    ));
  }

  }

  }

  public function message($string) {
    echo $string;
    die;
  }
}
