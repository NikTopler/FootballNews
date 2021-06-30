import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
    private leagueService: LeagueService) {
    router.events.subscribe(() => this.urlPath = router.url);
    route.params.subscribe(params => {
      leagueService.setOpenLeague(params.league);
      this.openLeague = params.league;
      leagueService.openLeague = params.league;
    });
    leagueService.fetchLeagues();
    leagueService.fetchNews();
    this.urlPath = router.url;
  }
}
