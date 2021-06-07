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
  teams: any[] = [];

  constructor(
    private router: Router,
    private leagueService: LeagueService) {
    leagueService.getPlayers()
      .subscribe((players) => this.playersWait = players);
  }

  sortPlayersByPenalties() { this.playersByPenalties.sort((a, b) => (a.penalties < b.penalties) ? 1 : -1) }

}
