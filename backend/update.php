<?php
include_once 'user.php';

class Update extends User {

  public function getAllUsers() {
    $sql = 'SELECT * FROM users';
    $stmt = $this->connect()->prepare($sql);
    $stmt->execute();
    $row = $stmt->fetch();

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
if(isset($_POST['GET_USERS'])) $updateObj->getAllUsers();
