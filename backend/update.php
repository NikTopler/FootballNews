<?php
include_once 'user.php';

class Update extends User {

  public function getAllUsers($data) {

    $sql = 'SELECT * FROM users ORDER BY id LIMIT '.$data->start.', '.$data->end;
    $stmt = $this->connect()->prepare($sql);
    $stmt->execute();

    $allUsers = [];

    while($row = $stmt->fetch()) {
      array_push($allUsers, [
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
        $row['safeImport'],
        $row['editImport']
      ]);
    }

    echo json_encode(array(
      "status" => "ok",
      "data" => $allUsers
    ));
  }

}

$updateObj = new Update();
if($_SERVER['REQUEST_METHOD'] !== 'POST') die;
if(isset($_POST['GET_USERS'])) $updateObj->getAllUsers(json_decode($_POST['GET_USERS']));
