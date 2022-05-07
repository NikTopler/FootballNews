<?php
include_once 'user.php';

class Graph extends User {

  public function adminImport($type) {
    $sql = 'SELECT u.firstName, u.lastName, u.email, ta.time, ta.type
            FROM admins ta
              INNER JOIN users u ON u.id = ta.admin_id
            WHERE LOWER(ta.type) = ?
              ORDER BY ta.admin_id';
    $stmt = $this->connect()->prepare($sql);
    $stmt->execute([$type]);
    $row = $stmt->fetch();

    $admin_data = [];
    while($row = $stmt->fetch())
      array_push($admin_data, [$row["firstName"],$row["lastName"],$row["email"], $row["type"],$row["time"]]);

    $sql = 'SELECT u.firstName, u.lastName, u.email, ta.time, ta.type
            FROM admins ta INNER JOIN users u ON u.id = ta.admin_id
            WHERE LOWER(ta.type) = ?
              ORDER BY ta.time';
    $stmt = $this->connect()->prepare($sql);
    $stmt->execute([$type]);
    $row = $stmt->fetch();

    $your_data = [];
    while($row = $stmt->fetch())
      array_push($your_data, [$row["firstName"],$row["lastName"],$row["email"], $row["type"],$row["time"]]);

    echo json_encode(array(
      "status" => "ok",
      "data" => [
        "admin_data" => $admin_data,
        "your_data" => $your_data
      ]
    ));
  }
}

$graphObj = new Graph();
if($_SERVER['REQUEST_METHOD'] !== 'POST') die;
if(isset($_POST['ADMIN_GRAPH'])) $graphObj->adminImport($_POST['ADMIN_GRAPH']);
