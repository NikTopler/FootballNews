import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LeagueService } from 'src/app/services/league/league.service';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss']
})
export class StatsComponent {

  playersWait: any = [];
  playersByGoals: any[] = [];
  playersByPenalties: any[] = [];
  playersByMinutes: any[] = [];
  teams: any[] = [];

  constructor(
    private router: Router,
    private leagueService: LeagueService) {
    leagueService.getPlayers()
      .subscribe((players) => this.playersWait = players);
    leagueService.getAllTeams()
      .subscribe((teams) => {
        this.teams = teams;
        this.playersByGoals = this.playersWait;
        this.playersByPenalties = [...this.playersWait];
        this.playersByMinutes = [...this.playersWait];
        this.sortPlayersByPenalties();
        this.sortPlayersByMinutes();
      });
  }

  getTeamLogo(id: string) {
    for(let i = 0; i < this.teams.length; i++)
      if(Number(id) === Number(this.teams[i].team_id))
        return this.teams[i].logo;
    return '';
  }

  sortPlayersByPenalties() { this.playersByPenalties.sort((a, b) => (a.penalties < b.penalties) ? 1 : -1) }
  sortPlayersByMinutes() { this.playersByMinutes.sort((a, b) => (a.minutes_played < b.minutes_played) ? 1 : -1) }

  search(name: string, club: string) { this.router.navigateByUrl(`/search?q=(${name})OR(${club})`) }
}
