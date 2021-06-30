<?php include_once './season.php';

class StandingsCRON extends SeasonCRON {

  public $website = 'https://www.google.com/search?tbm=isch&q=';
  public $images = array();

  public function setup() {

    $seasonArray = $this->getAllSeasons();

    for($i = 0; $i < count($seasonArray); $i++) {
      $seasonsFile = file_get_contents('https://app.sportdataapi.com/api/v1/soccer/seasons/'.$seasonArray[$i]->id.'?apikey=c54ab850-d202-11eb-9297-d55212e814f0');
      libxml_use_internal_errors(TRUE);
      $seasonObject = json_decode('['.$seasonsFile.']');
      $seasons = $seasonObject[0]->data;

      if($seasonArray[$i]->active != $seasons->is_current) {
        $sql = 'UPDATE seasons SET active = ? WHERE id = ?';
        $stmt = $this->connect()->prepare($sql);
        $stmt->execute([$seasons->is_current, $seasonArray[$i]->id]);
      }

      if($seasons->is_current == 0) continue;

      $standingFile = file_get_contents('https://app.sportdataapi.com/api/v1/soccer/standings?apikey=c54ab850-d202-11eb-9297-d55212e814f0&season_id='.$seasonArray[$i]->id);
      $standings = $this->setupStandings(json_decode($standingFile));

      $topScorersFile = file_get_contents('https://app.sportdataapi.com/api/v1/soccer/topscorers?apikey=c54ab850-d202-11eb-9297-d55212e814f0&season_id='.$seasonArray[$i]->id);
      $players = $this->setupPlayers(json_decode($topScorersFile));

      $this->insertIntoDB($seasonArray[$i]->id, 'standings', $standings);
      $this->insertIntoDB($seasonArray[$i]->id, 'top-scorers', $players);
    }
  }

  private function setupStandings($json) {
    $array = [];
    $standings = $json->data->standings;

    for($i = 0; $i < count($standings); $i++) {
      $teamData = $this->getTeam($standings[$i]->team_id);

      $schema = array(
        "position" => (int) $standings[$i]->position,
        "points" => $standings[$i]->points,
        "status" => $standings[$i]->status,
        "result" => $standings[$i]->result,
        "team" => array(
          "id" => (int) $teamData->id,
          "name" => $teamData->name,
          "shortCode" => $teamData->shortCode,
          "logo" => $teamData->logo
        ),
        "matches" => array(
          "played" => (int) $standings[$i]->overall->games_played,
          "wins" => (int) $standings[$i]->overall->won,
          "draws" => (int) $standings[$i]->overall->draw,
          "losses" => (int) $standings[$i]->overall->lost,
        ),
        "goals" => array(
          "for" => (int) $standings[$i]->overall->goals_scored,
          "against" => (int) $standings[$i]->overall->goals_against,
          "difference" => (int) $standings[$i]->overall->goals_diff,
        )
      );
      array_push($array, $schema);
    }
    return json_encode($array);
  }

  private function setupPlayers($json) {
    $array = [];
    $players = $json->data;

    for($i = 0; $i < count($players); $i++) {

      $profileImage = null;

      if($i < 30) {
        $xpath = $this->imageSetup($this->website.''.str_replace(' ', '+', $players[$i]->player->player_name));

        $images = $xpath->query('//img');
        foreach($images as $row) {
          $link = $row->getAttribute('src');
          if(strpos($link, '.gif') == false) {
            $profileImage = $link;
            break;
          }
        }
      }

      $teamData = $this->getTeam($players[$i]->team->team_id);

      array_push($array, array(
        "position" => (int) $players[$i]->pos,
        "minutes_played" => (int) $players[$i]->minutes_played,
        "substituted_in" => (int) $players[$i]->substituted_in,
        "penalties" => (int) $players[$i]->penalties,
        "player" => array(
          "id" => (int) $players[$i]->player->player_id,
          "name" => $players[$i]->player->player_name,
          "image" => $profileImage
          ),
        "team" => array(
          "id" => (int) $teamData->id,
          "name" => $teamData->name,
          "shortCode" => $teamData->shortCode,
          "logo" => $teamData->logo
        ),
        "goals" => array(
          "overall" => (int) $players[$i]->goals->overall,
          "home" => (int) $players[$i]->goals->home,
          "away" => (int) $players[$i]->goals->away
        ))
      );
    }
    return json_encode($array);
  }

  public function getTeam($teamID) {
    $sql = 'SELECT * FROM teams WHERE id = ?';
    $stmt = $this->connect()->prepare($sql);
    $stmt->execute([$teamID]);
    $row = $stmt->fetch();

    $schema = (object) array(
      "id" => $row['id'],
      "name" => $row['name'],
      "shortCode" => $row['shortCode'],
      "logo" => $row['logo']
    );

    return $schema;
  }

  private function imageSetup($website) {
    $html = file_get_contents($website);
    $news_doc = new DOMDocument();

    libxml_use_internal_errors(TRUE);

    if(empty($html)) die;

    $news_doc->loadHTML($html);
    libxml_clear_errors();

    return new DOMXPath($news_doc);
  }

  private function insertIntoDB($seasonID, $type, $data) {
    $date = date(time());

    $sql = 'SELECT * FROM season_info WHERE season_id = ? AND type = ?';
    $stmt = $this->connect()->prepare($sql);
    $stmt->execute([$seasonID, $type]);
    $row = $stmt->fetch();

    if($row) {
      $sql = 'UPDATE season_info SET time = ?, data = ? WHERE season_id = ? && type = ?';
      $stmt = $this->connect()->prepare($sql);
      $stmt->execute([$date, $data, $seasonID, $type]);
    } else {
      $sql = 'INSERT INTO season_info(season_id, time, type, data) VALUES(?, ?, ?, ?)';
      $stmt = $this->connect()->prepare($sql);
      $stmt->execute([$seasonID, $date, $type, $data]);
    }
  }

  private function getAllSeasons() {
    $sql = 'SELECT id, active FROM seasons';
    $stmt = $this->connect()->prepare($sql);
    $stmt->execute();

    $seasonArray = [];
    while($row = $stmt->fetch())
      json_encode(array_push(
        $seasonArray,
        (object) array( "id" => $row['id'], "active" => $row['active'])
      ));

    return $seasonArray;
  }
}

$standingsCRON = new StandingsCRON();
$standingsCRON->setup();

