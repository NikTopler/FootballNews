<?php include_once './season.php';

class TeamsCRON extends SeasonCRON {

  public function setupTeams() {
    $countries = $this->getAllCountries();

    for($i = 0; $i < count($countries); $i++) {
      $teams = file_get_contents('https://app.sportdataapi.com/api/v1/soccer/teams?apikey=9751a990-86f0-11eb-a0c8-6b846512b7c7&country_id='.$countries[$i]->id);
      libxml_use_internal_errors(TRUE);
      $this->insertTeams($teams);
    }
  }

  private function insertTeams($json) {
    $object = json_decode('['.$json.']');
    $teams = $object[0]->data;

    for($i = 0; $i < count($teams); $i++) {

      $sql = 'SELECT * FROM teams WHERE team_id = ?';
      $stmt = $this->connect()->prepare($sql);
      $stmt->execute([$teams[$i]->team_id]);
      $row = $stmt->fetch();

      if($row) continue;

      try {
        $sql = 'INSERT INTO teams(name, team_id, short_code, logo, country_id)
                VALUES(?,?,?,?,(SELECT id FROM countries WHERE country_id = ?))';
        $stmt = $this->connect()->prepare($sql);
        $stmt->execute([$teams[$i]->name, $teams[$i]->team_id, $teams[$i]->short_code, $teams[$i]->logo, $teams[$i]->country->country_id]);
      } catch(Exception $e) { echo $e; }
    }
  }

  public function getAllCountries() {
    $sql = 'SELECT * FROM countries';
    $stmt = $this->connect()->prepare($sql);
    $stmt->execute();
    $countryArray = [];
    while($row = $stmt->fetch())
      json_encode(array_push(
        $countryArray,
        (object) array(
          "id" => $row['country_id'],
          "name" => $row['name']
        )
      ));

    return $countryArray;
  }
}

$teamsCRONObj = new TeamsCRON();
$teamsCRONObj->setupTeams();
