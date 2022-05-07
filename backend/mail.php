<?php
include_once 'admin.php';

class Mail extends Admin {

  public function customEmail($data) {

    $date = date(time());

    for($i = 0; $i < count($data->emails); $i++) {
      $headers = '';
      for($j = 0; $j < count($data->headers); $j++)
        $headers .= $data->headers[$j]."\r\n";

      try {
        mail($data->emails[$i], $data->subject, $data->message, $headers);
      } catch(Exception $e) {
        echo json_encode(array(
          "status" => 404,
          "data" => $e
        ));
        die;
      }

      $sql = 'INSERT INTO emails(time, subject, message, email) VALUES(?, ?, ?, ?)';
      $stmt = $this->connect()->prepare($sql);
      $stmt->execute([$date, $data->subject, $data->message, $data->emails[$i]]);
      $this->adminCheckUp($data->adminEmail, $date, 'email', 'email', 'email_id', null);
    }

    echo json_encode(array(
      "status" => "ok",
      "data" => ""
    ));
  }

  public function getAllSentMails($limit) {

    $sql = 'SELECT
        u.firstName as adminFirstName,
        u.lastName as adminLastName,
        u.email as admin,
        s.time as time,
        s.subject as subject,
        s.message as message,
        s.email as reciever
      FROM sendEmails s
        INNER JOIN track_admin ta ON ta.sendEmails_id = s.id
        INNER JOIN users u ON ta.admin_id = u.id
        ORDER BY s.time DESC
        LIMIT '.$limit->startLimit.', '.$limit->endLimit;
    $stmt = $this->connect()->prepare($sql);
    $stmt->execute();

    $allSentEmails= [];
    while($row = $stmt->fetch()) {
      array_push($allSentEmails, [
        "adminFirstName" => $row["adminFirstName"],
        "adminLastName" => $row["adminLastName"],
        "admin" => $row["admin"],
        "time" => $row["time"],
        "subject" => $row["subject"],
        "message" => $row["message"],
        "reciever" => $row["reciever"]
      ]);
    }

    echo json_encode(array(
      "status" => "ok",
      "data" => [
        "emails" => $allSentEmails
      ]
    ));
  }
}

$mailObj = new Mail();
if($_SERVER['REQUEST_METHOD'] !== 'POST') die;
if(isset($_POST['CUSTOM_EMAIL'])) $mailObj->customEmail(json_decode($_POST['CUSTOM_EMAIL']));
else if(isset($_POST['GET_ALL_SENT_MAILS'])) $mailObj->getAllSentMails(json_decode($_POST['GET_ALL_SENT_MAILS']));
