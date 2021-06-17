import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommService } from 'src/app/services/comm/comm.service';
import { LeagueService } from 'src/app/services/league/league.service';

@Component({
  selector: 'app-leagues',
  templateUrl: './leagues.component.html',
  styleUrls: ['./leagues.component.scss']
})
export class LeaguesComponent {

  urlPath: string = '';
  openLeague: string = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private leagueService: LeagueService,
    private comm: CommService) {
    router.events.subscribe(() => this.urlPath = router.url);
    route.params.subscribe(params => { leagueService.setOpenLeague(params.league) });
    leagueService.getOpenLeague().subscribe((league) => {
      this.openLeague = league;
      leagueService.openLeague = league;
    });
    leagueService.fetchPlayers();
    leagueService.fetchTeams();
    leagueService.fetchNews();
    leagueService.fetchPlayerImages();
    leagueService.fetchStandings();
    leagueService.fetchMatches();
    this.urlPath = router.url;
  }
}
