<?php
include_once 'config/db.php';
require __DIR__ . '/libs/vendor/autoload.php';
use \Firebase\JWT\JWT;

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

  public function getUserData($type, $data) {
    $sql = 'SELECT
      u.id AS id,
      u.firstName as firstName,
      u.lastName as lastName,
      u.email as email,
      u.admin as admin,
      u.createdAt as createdAt,
      u.updatedAt as updatedAt,
      u.profileImg as profileImg,
      u.googleID as googleID,
      u.facebookID as facebookID,
      u.amazonID as amazonID,
      u.refreshToken as refreshToken,
      s.safeImport as safeImport,
      s.editImport as editImport,
      s.emailingService as emailingService
    FROM users u INNER JOIN settings s ON u.id = s.user_id
    WHERE u.'.$type.' = ?';
    $stmt = $this->connect()->prepare($sql);
    $stmt->execute([$data]);
    $row = $stmt->fetch();

    $sql = 'SELECT * FROM follows f
      INNER JOIN leagues l ON l.id = f.league_id
      WHERE user_id = (SELECT id FROM users WHERE '.$type.' = ?)';
    $stmt = $this->connect()->prepare($sql);
    $stmt->execute([$data]);

    $followLeagueArray = [];
    while($follows = $stmt->fetch()) {
      array_push(
        $followLeagueArray,
        array(
          "name" => $follows['name'],
          "time" => $follows['time']
        )
      );
    }

    $userArray = array(
      "id" => $row['id'],
      "firstName" => $row['firstName'],
      "lastName" => $row['lastName'],
      "email" => $row['email'],
      "admin" =>  $row['admin'],
      "createdAt" => $row['createdAt'],
      "updatedAt" =>  $row['updatedAt'],
      "profileImg" => $row['profileImg'],
      "googleID" =>  $row['googleID'],
      "facebookID" =>  $row['facebookID'],
      "amazonID" =>  $row['amazonID'],
      "safeImport" => $row['safeImport'],
      "editImport" =>  $row['editImport'],
      "emailingService" =>  $row['emailingService'],
      "following" =>  $followLeagueArray
    );

    return $userArray;
  }

  public function generateTokens($userInfo) {

    $object = (object) $userInfo;

    $jwtAccessToken = $this->generateAccessToken($userInfo);
    $jwtRefreshToken = $this->generateRefreshToken($object->id);

    http_response_code(200);

    return json_encode(array(
      "status" => "ok",
      "jwt" => $jwtAccessToken,
      "refreshToken" => $jwtRefreshToken,
      "id" => $object->id,
      "data" => $userInfo,
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
    $userData = $this->getUserData('refreshToken', $refreshToken);
    $newAccessToken = $this->generateAccessToken($userData);
    echo $newAccessToken;
  }

  public function generateAccessToken($userInfo) {
    include 'config/core.php';

    $payload_info = array(
      "iss" => $iss,
      "iat" => $iat,
      "nbf" => $nbf,
      "exp" => $exp,
      "aud" => $aud,
      "data" => $userInfo
    );

    try { return JWT::encode($payload_info, $secret, 'HS512'); }
    catch(Exception $e) { $this->response(500, $e); }
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
     catch (Exception $e) { $this->response(500, $e); }
  }

  public function updateAccount($userInfo) {
    $sql = 'UPDATE users SET firstName = ? WHERE email = ?';
    $stmt = $this->connect()->prepare($sql);
    $stmt->execute([$userInfo->firstName, $userInfo->email]);

    $sql = 'UPDATE users SET lastName = ? WHERE email = ?';
    $stmt = $this->connect()->prepare($sql);
    $stmt->execute([$userInfo->lastName, $userInfo->email]);

    $date = date(time());
    $sql = 'UPDATE users SET updatedAt = ? WHERE email = ?';
    $stmt = $this->connect()->prepare($sql);
    $stmt->execute([$date, $userInfo->email]);
  }

  public function safeImport($userInfo) {
    if((int)$userInfo->preference == 0) $this->editImport($userInfo);

    $sql = 'UPDATE settings SET safeImport = ? WHERE user_id = (SELECT id FROM users WHERE email = ?)';
    $stmt = $this->connect()->prepare($sql);
    $stmt->execute([(int)$userInfo->preference, $userInfo->email]);
  }

  public function editImport($userInfo) {
    if((int)$userInfo->preference == 1) $this->safeImport($userInfo);

    $sql = 'UPDATE settings SET editImport = ? WHERE user_id = (SELECT id FROM users WHERE email = ?)';
    $stmt = $this->connect()->prepare($sql);
    $stmt->execute([(int)$userInfo->preference, $userInfo->email]);
  }

  public function response($code, $status, $text = '') {
    http_response_code($code);
    echo json_encode(array(
      "status" => $status,
      "message" => $text
    ));
    die;
  }
}

$userObj = new User();

$allowed_domains = ["http://localhost:4200", "https://footballnews-app.herokuapp.com"];

if (in_array($_SERVER['HTTP_ORIGIN'], $allowed_domains)) header("Access-Control-Allow-Origin: " . $_SERVER['HTTP_ORIGIN']);
else $userObj->response(403, 'Access denied', 'Authorization failed');


if($_SERVER['REQUEST_METHOD'] !== 'POST') die;
if(isset($_POST['VALIDATE_REFRESH_TOKEN'])) $userObj->checkRefreshToken($_POST['VALIDATE_REFRESH_TOKEN']);
else if(isset($_POST['VALIDATE_ACCESS_TOKEN'])) $userObj->checkAccessToken($_POST['VALIDATE_ACCESS_TOKEN']);
else if(isset($_POST['REGENERATE_ACCESS_TOKEN'])) $userObj->regenerateAccessToken($_POST['REGENERATE_ACCESS_TOKEN']);
else if(isset($_POST['UPDATE_ACCOUNT'])) $userObj->updateAccount(json_decode($_POST['UPDATE_ACCOUNT']));
else if(isset($_POST['SAFE_IMPORT'])) $userObj->safeImport(json_decode($_POST['SAFE_IMPORT']));
else if(isset($_POST['EDIT_IMPORT'])) $userObj->editImport(json_decode($_POST['EDIT_IMPORT']));
