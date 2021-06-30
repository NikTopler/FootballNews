import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommService } from 'src/app/services/comm/comm.service';
import { LeagueService, Player, Season } from 'src/app/services/league/league.service';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss']
})
export class StatsComponent {

  playersByGoals: Player[] = [];
  playersByPenalties: Player[] = [];
  playersByMinutes: Player[] = [];

  season: Season = this.leagueService.activeSeason;

  constructor(
    private router: Router,
    private comm: CommService,
    private leagueService: LeagueService) {
    leagueService.getActiveSeason().subscribe(data => {
      this.season = data;
      this.playersByGoals = data.players;
      this.playersByPenalties = [...data.players];
      this.playersByMinutes = [...data.players];
      this.sortPlayersByPenalties();
      this.sortPlayersByMinutes();
    });
  }

  sortPlayersByPenalties() { this.playersByPenalties.sort((a, b) => (a.penalties < b.penalties) ? 1 : -1) }
  sortPlayersByMinutes() { this.playersByMinutes.sort((a, b) => (a.minutes_played < b.minutes_played) ? 1 : -1) }
  setupDate(date: string) { return this.comm.setupDate(date); }
  search(name: string, club: string) { this.router.navigateByUrl(`/search?q=(${name})OR(${club})`) }
}
