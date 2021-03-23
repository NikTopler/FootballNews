<?php
include_once 'db.php';

class User extends Dbh {

    public function checkIfUserExists($email) {
        $sql = 'SELECT * FROM users WHERE email = ?';
        $stmt = $this->connect()->prepare($sql);
        $stmt->execute([$email]);
        $row = $stmt->fetch();
        if($row) echo 'User exists';
        else echo 'User doesn\'t exist';
    }
}