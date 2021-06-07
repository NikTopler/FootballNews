import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment} from '../../../environments/environment';
import { CommService } from '../comm/comm.service';

@Injectable({
  providedIn: 'root'
})
export class LeagueService {

  openLeague: string = '';
  leaguesOptions: any[] = [
    { name: 'matches', active: false },
    { name: 'news', active: false },
    { name: 'standings', active: false },
    { name: 'stats', active: false },
    { name: 'players', active: false },
  ];

  $openLeague: BehaviorSubject<string>;
  $leaguesOptions: BehaviorSubject<any[]>;
  $players: BehaviorSubject<any[]>;
  $allTeams: BehaviorSubject<any[]>;

  $news: BehaviorSubject<any[]>;

  constructor(private comm: CommService, private router: Router) {
    router.events.subscribe(() => this.setActivePage());
    this.$openLeague = new BehaviorSubject<string>('');
    this.$leaguesOptions = new BehaviorSubject<any[]>(this.leaguesOptions);
    this.$players = new BehaviorSubject<any[]>([]);
    this.$allTeams = new BehaviorSubject<any[]>([]);
    this.$news = new BehaviorSubject<any[]>([]);
  }

  setOpenLeague(newValue: string): void { this.$openLeague.next(newValue); }
  getOpenLeague(): Observable<string> { return this.$openLeague.asObservable(); }

  setLeagueOptions(newValue: any[]): void { this.$leaguesOptions.next(newValue); }
  getLeagueOptions(): Observable<any[]> { return this.$leaguesOptions.asObservable(); }

  setPlayers(newValue: any[]): void { this.$players.next(newValue); }
  getPlayers(): Observable<any[]> { return this.$players.asObservable(); }

  setAllTeams(newValue: any[]): void { this.$allTeams.next(newValue); }
  getAllTeams(): Observable<any[]> { return this.$allTeams.asObservable(); }

  setNews(newValue: any[]): void { this.$news.next(newValue); }
  getNews(): Observable<any[]> { return this.$news.asObservable(); }

  async fetchPlayers() {
    let league = this.comm.leagueNameChange(this.openLeague);
    const req = await fetch(`${environment.db}/news.php`, {
      method: 'POST',
      body: this.comm.createFormData('PLAYERS', league)
    });
    const res = await req.text();
    const json = JSON.parse(res);
    const players = JSON.parse(json.players.data).data;
    this.setPlayers(players);
  }

  async fetchTeams() {
    let league = this.comm.leagueNameChange(this.openLeague);
    const req = await fetch(`${environment.db}/news.php`, {
      method: 'POST',
      body: this.comm.createFormData('GET_ALL_TEAM', league)
    });
    const res = await req.text();
    const json = JSON.parse(res);
    const teams = json.teams;
    this.setAllTeams(teams);
  }

  async fetchNews() {
    const req = await fetch(`${environment.db}/news.php`, {
      method: 'POST',
      body: this.comm.createFormData('HOME_NEWS', '')
    });
    const text = await req.text();
    const res = JSON.parse(text);

    if(res.status !== 'ok') return;

    if(this.openLeague === 'laliga') this.setNews(JSON.parse(res.laliga).articles);
    else if(this.openLeague == 'premier-league') this.setNews(JSON.parse(res.premier_league).articles);
  }

  setActivePage() {
    for(let i = 0; i < this.leaguesOptions.length; i++) {
      if(this.leaguesOptions[i].active && !this.router.url.includes(this.leaguesOptions[i].name))
        this.leaguesOptions[i].active = false;
      if(this.router.url.includes(this.leaguesOptions[i].name))
        this.leaguesOptions[i].active = true;
    }
    this.setLeagueOptions(this.leaguesOptions);
  }
}
