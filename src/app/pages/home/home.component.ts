import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommService } from 'src/app/services/comm/comm.service';
import { environment } from '../../../environments/environment';

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

  allLeagues: any = [];

  constructor(
    private router: Router,
    private comm: CommService) {
    this.getAllLeagues();
    this.setupLatestNews();
  }

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

  get getAllLatestNews() { return document.querySelectorAll('.news-article'); }

  async setupLatestNews() {
    let laliga = await this.latestNews('soccer');
    if(!laliga) return;
    this.latestNewsArray = laliga.sort((a: any ,b: any) => (a.publishedAt < b.publishedAt) ? 1 : ((b.publishedAt < a.publishedAt) ? -1 : 0));
  }

  async latestNews(word: string) {
    const req = await fetch(`${environment.db}/news.php`, {
      method: 'POST',
      body: this.comm.createFormData('LATEST_NEWS', word)
    });
    const text = await req.text();
    const res = JSON.parse(text);
    const data = JSON.parse(res.data);
    if(res.status === 'ok') return data.articles;
    return null;
  }

  async getAllLeagues() {
    const req = await fetch(`${environment.db}/update.php`, {
      method: 'POST',
      body: this.comm.createFormData('GET_LEAGUES', '')
    });
    const res = await req.text();
    const leagues: string[][] = JSON.parse(res).data;

    for(let i = 0; i < leagues.length; i++) {

      let path = '';
      if(leagues[i][0].toLowerCase() === 'laliga') path = 'laliga';
      else if(leagues[i][0].toLowerCase() === 'premier league') path = 'premier-league';

      this.allLeagues.push({ name: leagues[i][0], path: path });
    }
  }

  openLink(url: string) { window.open(url); }
  openPage(page: string) { this.router.navigateByUrl(page); }
}
