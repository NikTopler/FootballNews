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
      $row['refreshToken'],
      $row['safeImport'],
      $row['editImport']
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

  public function checkRefreshToken($token) {
    include 'config/core.php';
    try {
      $decode = JWT::decode($token, $refreshSecret, array('HS512'));
      http_response_code(200);
      echo json_encode(array(
        "status" => "Good",
        "data" => $decode
      ));
    } catch(Exception $e) {
      http_response_code(500);
      echo json_encode(array(
        "status" => "Expired refresh token"
      ));
    }
  }

  public function checkAccessToken($token) {
    include 'config/core.php';
    try {
      $decode = JWT::decode($token, $secret, array('HS512'));
      http_response_code(200);
      echo json_encode(array(
        "status" => "Good",
        "data" => $decode
      ));
    } catch (Exception $e) {
      http_response_code(500);
      echo json_encode(array(
        "status" => "Expired access token"
      ));
    }
  }

  public function regenerateAccessToken($refreshToken) {

    $sql = 'SELECT * FROM users WHERE refreshToken = ?';
    $stmt = $this->connect()->prepare($sql);
    $stmt->execute([$refreshToken]);
    $row = $stmt->fetch();

    if(!$row) $this->message('Login reqired');

    $newAccessToken = $this->generateAccessToken([
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
      $row['refreshToken'],
      $row['safeImport'],
      $row['editImport']
    ]);

    echo $newAccessToken;
  }

  public function generateAccessToken($userInfo) {
    include 'config/core.php';

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
      "amazonID" => $userInfo[10],
      "safeImport" => $userInfo[12],
      "editImport" => $userInfo[13]
    );

    $payload_info = array(
      "iss" => $iss,
      "iat" => $iat,
      "nbf" => $nbf,
      "exp" => $exp,
      "aud" => $aud,
      "data" => $data
    );

    try { return JWT::encode($payload_info, $secret, 'HS512'); }
    catch(Exception $e) { $this->message($e); }
  }

  public function generateRefreshToken($id) {
    include 'config/core.php';

    $payloadRefresh_info = array(
      "iss" => $iss,
      "iat" => $iat,
      "nbf" => $nbf,
      "exp" => $exp + 3600 * 24 * 2,
      "aud" => $aud,
      "token" => $id
    );

     try { return JWT::encode($payloadRefresh_info, $refreshSecret, 'HS512'); }
     catch (Exception $e) { $this->message($e); }
  }

  public function updateAccount($userInfo) {
    $sql = 'UPDATE users SET firstName = ? WHERE email = ?';
    $stmt = $this->connect()->prepare($sql);
    $stmt->execute([$userInfo[0], $userInfo[2]]);

    $sql = 'UPDATE users SET lastName = ? WHERE email = ?';
    $stmt = $this->connect()->prepare($sql);
    $stmt->execute([$userInfo[1], $userInfo[2]]);

    $date = date(time());
    $sql = 'UPDATE users SET updatedAt = ? WHERE email = ?';
    $stmt = $this->connect()->prepare($sql);
    $stmt->execute([$date, $userInfo[2]]);

    die;
  }

  public function message($string) {
    echo $string;
    die;
  }
}

$userObj = new User();
if($_SERVER['REQUEST_METHOD'] !== 'POST') die;
if(isset($_POST['VALIDATE_REFRESH_TOKEN'])) $userObj->checkRefreshToken($_POST['VALIDATE_REFRESH_TOKEN']);
else if(isset($_POST['VALIDATE_ACCESS_TOKEN'])) $userObj->checkAccessToken($_POST['VALIDATE_ACCESS_TOKEN']);
else if(isset($_POST['REGENERATE_ACCESS_TOKEN'])) $userObj->regenerateAccessToken($_POST['REGENERATE_ACCESS_TOKEN']);
else if(isset($_POST['UPDATE_ACCOUNT'])) $userObj->updateAccount(json_decode($_POST['UPDATE_ACCOUNT']));
