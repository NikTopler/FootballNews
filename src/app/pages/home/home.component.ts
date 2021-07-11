import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommService, Following, Leagues } from 'src/app/services/comm/comm.service';
import { LeagueService } from 'src/app/services/league/league.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  latestNewsArray: any[] = [];
  showLeftArrow: boolean = false;
  showRightArrow: boolean = true;
  direction: number = 0;

  laligaNewsArray: any[] = [];
  laligaNumber: number = 1;

  premierLeagueNewsArray: any[] = [];
  premierLeagueNumber: number = 1;

  championsLeague: any[] = [];

  allLeagues: Leagues[] = [];
  following: Following[] = [];

  headingArticle: any;

  constructor(
    private router: Router,
    private comm: CommService,
    private userService: UserService,
    private leagueService: LeagueService) {
    this.comm.setIsLoaded(false);
    this.userService.getUserData()
      .subscribe(userInfo => this.following = userInfo.following ? userInfo.following : []);
    this.getAllLeagues();
    this.setupLatestNews();
  }

  get getAllLatestNews() { return document.querySelectorAll('.news-article'); }

  changeLatestNews(direction: string) {

    direction === 'left' ? this.direction += 285 : this.direction += -285;

    if(this.direction === 0) {
      this.showLeftArrow = false;
      this.showRightArrow = true;
    } else if(this.direction * (-1) === (285 * this.latestNewsArray.length - 285 * 4)) {
      this.showLeftArrow = true;
      this.showRightArrow = false;
    } else {
      this.showLeftArrow = true;
      this.showRightArrow = true;
    }

    for(let i = 0; i < this.getAllLatestNews.length; i++) {
      let element = this.getAllLatestNews[i] as HTMLDivElement;
      element.style.transform = `translateX(${this.direction}px)`;
    }
  }

  sortNews(articles: any) { return articles.sort((a: any, b: any) => (a.publishedAt < b.publishedAt) ? 1 : ((b.publishedAt < a.publishedAt) ? -1 : 0)) }

  setupHeadingArticle() {
    const randomNumber = Math.floor(Math.random() * this.championsLeague.length - 1);
    const article = this.championsLeague[randomNumber];

    if(article && article.urlToImage && article.title && article.description && article.author && article.url) {
      this.headingArticle = article;
      this.comm.setIsLoaded(true);
    } else this.setupHeadingArticle();
  }

  addActiveClass(name: string) { return this.comm.addActiveClass(this.following, name); }
  openLink(url: string) { window.open(url); }
  openPage(page: string) { this.router.navigateByUrl(`leagues/${page}/standings`); }

  async setupLatestNews() {
    if(this.following)
      for(let i = 0; i < this.following.length; i++)
        if(this.following[i].name === 'Laliga') this.laligaNumber = 5;
        else if(this.following[i].name === 'Premier League') this.premierLeagueNumber = 5;

    const newsArticles = await this.latestNews();

    if(newsArticles) {
      this.latestNewsArray = this.sortNews(JSON.parse(newsArticles.latest).articles);
      this.laligaNewsArray = this.sortNews(JSON.parse(newsArticles.laliga).articles);
      this.premierLeagueNewsArray = this.sortNews(JSON.parse(newsArticles.premier_league).articles);
      this.championsLeague = this.sortNews(JSON.parse(newsArticles.champions_league).articles);
    }

    this.setupHeadingArticle();
  }

  async latestNews() { return await this.leagueService.fetchNews(); }

  async getAllLeagues() { this.allLeagues = await this.comm.getAllLeagues(); }
}
