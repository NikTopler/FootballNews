<?php
include_once 'user.php';

class Graph extends User {

  public function adminImport() {

  }
}

$graphObj = new Graph();
if($_SERVER['REQUEST_METHOD'] !== 'POST') die;
if(isset($_POST['ADMIN_IMPORT'])) $graphObj->adminImport();
