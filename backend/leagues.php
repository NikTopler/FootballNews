<?php include_once 'user.php';

class Leagues extends User {

  public function leagueData() {
    $leagues = $this->getAllLeagues();

    $leagueArray = [];
    for($i = 0; $i < count($leagues); $i++) {
      $seasons = $this->seasons($leagues[$i]->id);
      array_push($leagueArray, array(
        "id" => (int) $leagues[$i]->id,
        "name" => $leagues[$i]->name,
        "seasons" => $seasons
      ));
    }
    $array = array("status" => 200, "data" => $leagueArray);
    echo json_encode($array);
  }

  private function getAllLeagues() {
    $sql = 'SELECT * FROM leagues';
    $stmt = $this->connect()->prepare($sql);
    $stmt->execute();

    $leaguesArray = [];
    while($row = $stmt->fetch())
      array_push($leaguesArray, (object) array("id" => (int) $row['id'],"name" => $row['name']));
    return $leaguesArray;
  }

  private function seasons($leagueID) {

    $sql = 'SELECT * FROM seasons s WHERE s.league_id = ? ORDER BY s.start DESC;';
    $stmt = $this->connect()->prepare($sql);
    $stmt->execute([$leagueID]);

    $seasonsArray = [];
    while($row = $stmt->fetch()) {
      $standings = $this->getSeasonData($row['id'], 'standings');
      $players = $this->getSeasonData($row['id'], 'top-scorers');
      $teams = $this->getTeams($row['id']);

      if((int) $row['active'] == 1) $boolean = true;
      else $boolean = false;

      array_push($seasonsArray,
        array(
          "id" => (int) $row['id'],
          "start" => $row['start'],
          "end" => $row['end'],
          "name" => $row['name'],
          "active" => $boolean,
          "standings" => json_decode($standings),
          "teams" => $teams,
          "players" => json_decode($players)
        ));
    }
    return $seasonsArray;
  }

  public function getSeasonData($seasonID, $type) {
    $sql = 'SELECT * FROM seasons s INNER JOIN season_info i ON s.id = i.season_id WHERE s.id = ? AND i.type = ?';
    $stmt = $this->connect()->prepare($sql);
    $stmt->execute([$seasonID, $type]);
    $row = $stmt->fetch();
    return $row['data'];
  }

  public function getTeams($seasonID) {
    $sql = 'SELECT t.id as id, t.name as name, t.shortCode as shortCode, t.logo as logo
            FROM teams t INNER JOIN season_team st ON t.id = st.team_id INNER JOIN seasons s ON s.id = st.season_id
            WHERE s.id = ?';
    $stmt = $this->connect()->prepare($sql);
    $stmt->execute([$seasonID]);
    $teamArray = [];
    while($row = $stmt->fetch())
      array_push($teamArray,
      array(
        "id" => $row['id'],
        "name" => $row['name'],
        "shortCode" => $row['shortCode'],
        "logo" => $row['logo']
      ));
    return $teamArray;
  }
}

$leagueObj = new Leagues();
if($_SERVER['REQUEST_METHOD'] !== 'POST') die;
if(isset($_POST['LEAGUE_DATA'])) $leagueObj->leagueData();
