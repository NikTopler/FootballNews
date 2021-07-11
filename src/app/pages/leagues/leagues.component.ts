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
    this.setup();
  }

  async setup() {
    this.urlPath = this.router.url;
    this.leagueService.fetchLeagues();

    const news = await this.leagueService.fetchNews();
    if(news.status !== 'ok') return;

    if(this.openLeague === 'laliga') this.leagueService.setNews(JSON.parse(news.laliga).articles);
    else if(this.openLeague == 'premier-league') this.leagueService.setNews(JSON.parse(news.premier_league).articles);
  }
}
