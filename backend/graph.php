<?php
include_once 'user.php';

class Graph extends User {

  public function adminImport() {
    $sql = 'SELECT u.firstName, u.lastName, u.email, ta.time, ta.type FROM track_admin ta INNER JOIN users u ON u.id = ta.admin_id';
    $stmt = $this->connect()->prepare($sql);
    $stmt->execute();
    $row = $stmt->fetch();

    $admin_imports = [];
    while($row = $stmt->fetch())
      array_push($admin_imports, [$row["firstName"],$row["lastName"],$row["email"], $row["type"],$row["time"]]);

    $sql = 'SELECT u.firstName, u.lastName, u.email, ta.time, ta.type FROM track_admin ta INNER JOIN users u ON u.id = ta.admin_id ORDER BY ta.time';
    $stmt = $this->connect()->prepare($sql);
    $stmt->execute();
    $row = $stmt->fetch();

    $your_imports = [];
    while($row = $stmt->fetch())
      array_push($your_imports, [$row["firstName"],$row["lastName"],$row["email"], $row["type"],$row["time"]]);


    echo json_encode(array(
      "status" => "ok",
      "data" => [
        "admin_imports" => $admin_imports,
        "your_imports" => $your_imports
      ]
    ));

  }
}

$graphObj = new Graph();
if($_SERVER['REQUEST_METHOD'] !== 'POST') die;
if(isset($_POST['ADMIN_IMPORT'])) $graphObj->adminImport();
