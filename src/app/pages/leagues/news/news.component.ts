import { Component } from '@angular/core';
import { LeagueService } from 'src/app/services/league/league.service';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss']
})
export class NewsComponent {

  news: any[] = [];

  constructor(private leagueService: LeagueService) {
    leagueService.getNews()
      .subscribe((data) => this.news = data);
  }

  openLink(link: string) { window.open(link); }
}
