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

      try {
        $sql = 'INSERT INTO sendEmails(time, subject, message, email) VALUES(?, ?, ?, ?)';
        $stmt = $this->connect()->prepare($sql);
        $stmt->execute([$date, $data->subject, $data->message, $data->emails[$i]]);
      } catch(Exception $e) {
        echo json_encode(array(
          "status" => 404,
          "data" => $e
        ));
        die;
      }

      $this->adminCheckUp($data->adminEmail, $date, 'email', 'email', 'sendEmails_id', null);
    }

    echo json_encode(array(
      "status" => "ok",
      "data" => ""
    ));
  }

  }
}

$mailObj = new Mail();
if($_SERVER['REQUEST_METHOD'] !== 'POST') die;
if(isset($_POST['CUSTOM_EMAIL'])) $mailObj->customEmail(json_decode($_POST['CUSTOM_EMAIL']));

