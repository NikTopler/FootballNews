<?php
include_once '../config/db.php';

class SeasonCRON extends Dbh {

  public function setupSeasons() {
    $leagues = $this->getLeagueIDs();
    for($i = 0; $i < count($leagues); $i++) {
      $teams = file_get_contents('https://app.sportdataapi.com/api/v1/soccer/seasons?apikey=9751a990-86f0-11eb-a0c8-6b846512b7c7&league_id='.$leagues[$i]->id);
      libxml_use_internal_errors(TRUE);
      $this->insertSeasons($teams);
    }
  }

  private function insertSeasons($json) {
    $object = json_decode('['.$json.']');
    $seasons = $object[0]->data;

    for($i = 0; $i < count($seasons); $i++) {
      $teamsString = file_get_contents('https://app.sportdataapi.com/api/v1/soccer/standings?apikey=9751a990-86f0-11eb-a0c8-6b846512b7c7&season_id='.$seasons[$i]->season_id);
      libxml_use_internal_errors(TRUE);
      $object = json_decode('['.$teamsString.']');
      $teams = $object[0]->data->standings;

      for($j = 0; $j < count($teams); $j++) {

        $sql = 'SELECT * FROM league_team WHERE team_id = ? && season_id = ?';
        $stmt = $this->connect()->prepare($sql);
        $stmt->execute([$teams[$j]->team_id, $seasons[$i]->season_id]);
        $row = $stmt->fetch();

        if($row) continue;

        try {
          $sql = 'INSERT INTO league_team(startDate, endDate, team_id, league_id, season_id)
                    VALUES(?,?,?,?,?)';
            $stmt = $this->connect()->prepare($sql);
            $stmt->execute([$seasons[$i]->start_date, $seasons[$i]->end_date, $teams[$j]->team_id, $seasons[$i]->league_id, $seasons[$i]->season_id]);
        } catch(Exception $e) { echo $e; }
      }
    }
  }

  private function getLeagueIDs() {
    $sql = 'SELECT * FROM leagues';
    $stmt = $this->connect()->prepare($sql);
    $stmt->execute();
    $leagueArray = [];
    while($row = $stmt->fetch())
      json_encode(array_push(
        $leagueArray,
        (object) array(
          "id" => $row['league_id'],
          "name" => $row['name']
        )
      ));
    return $leagueArray;
  }
}

$seasonCRONObj = new SeasonCRON();
$seasonCRONObj->setupSeasons();
