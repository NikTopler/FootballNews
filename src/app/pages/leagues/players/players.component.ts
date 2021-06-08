import { Component } from '@angular/core';
import { LeagueService } from 'src/app/services/league/league.service';

@Component({
  selector: 'app-players',
  templateUrl: './players.component.html',
  styleUrls: ['./players.component.scss']
})
export class PlayersComponent {

  players: any[] = [];
  playerImages: string[] = [];
  teams: any[] = [];

  constructor(private leagueService: LeagueService) {
    leagueService.getPlayers().subscribe((data) => this.players = data);
    leagueService.getAllTeams().subscribe((data) => this.teams = data);
    leagueService.getPlayersImages().subscribe((data) => { this.playerImages = data; console.log(data)});
  }

  getTeamLogo(id: string) {
    for(let i = 0; i < this.teams.length; i++)
      if(Number(id) === Number(this.teams[i].team_id))
        return this.teams[i].logo;
    return '';
  }
}
