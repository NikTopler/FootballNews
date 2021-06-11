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
  $playersImages: BehaviorSubject<string[]>;
  $allTeams: BehaviorSubject<any[]>;

  $standings: BehaviorSubject<StandingsInterface[]>;
  $news: BehaviorSubject<any[]>;

  constructor(private comm: CommService, private router: Router) {
    router.events.subscribe(() => this.setActivePage());
    this.$openLeague = new BehaviorSubject<string>('');
    this.$leaguesOptions = new BehaviorSubject<any[]>(this.leaguesOptions);
    this.$players = new BehaviorSubject<any[]>([]);
    this.$playersImages = new BehaviorSubject<string[]>([]);
    this.$allTeams = new BehaviorSubject<any[]>([]);
    this.$standings = new BehaviorSubject<StandingsInterface[]>([]);
    this.$news = new BehaviorSubject<any[]>([]);
  }

  setOpenLeague(newValue: string): void { this.$openLeague.next(newValue); }
  getOpenLeague(): Observable<string> { return this.$openLeague.asObservable(); }

  setLeagueOptions(newValue: any[]): void { this.$leaguesOptions.next(newValue); }
  getLeagueOptions(): Observable<any[]> { return this.$leaguesOptions.asObservable(); }

  setPlayers(newValue: any[]): void { this.$players.next(newValue); }
  getPlayers(): Observable<any[]> { return this.$players.asObservable(); }

  setPlayersImages(newValue: any[]): void { this.$playersImages.next(newValue); }
  getPlayersImages(): Observable<string[]> { return this.$playersImages.asObservable(); }

  setAllTeams(newValue: any[]): void { this.$allTeams.next(newValue); }
  getAllTeams(): Observable<any[]> { return this.$allTeams.asObservable(); }

  setStandings(newValue: StandingsInterface): void { this.$standings.next(this.$standings.getValue().concat([newValue])); }
  setStandingsArray(newValue: StandingsInterface[]): void { this.$standings.next(newValue); }
  getStandings(): Observable<StandingsInterface[]> { return this.$standings.asObservable(); }

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

  async fetchPlayerImages() {
    const req = await fetch(`${environment.db}/webscraper.php`, {
      method: 'POST',
      body: this.comm.createFormData('GOOGLE_IMAGE', this.openLeague.replace('-', '_'))
    });
    const text = await req.text();
    const res = JSON.parse(text);
    const league = JSON.parse(res.league).data;
    this.setPlayersImages(league);
  }

  async fetchStandings() {
    const req = await fetch(`${environment.db}/news.php`, {
      method: 'POST',
      body: this.comm.createFormData('GET_STANDING', this.openLeague.replace('-', '_'))
    });
    const text = await req.text();
    const res = JSON.parse(text);

    if(res.status !== 'ok') return;

    const apiData = JSON.parse(res.standing);
    console.log(apiData)
    this.setStandingsArray([]);
    for(let i = 0; i < apiData.data.standings.length; i++) {
      const req = await fetch(`${environment.db}/news.php`, {
        method: 'POST',
        body: this.comm.createFormData('GET_TEAM', apiData.data.standings[i].team_id)
      });
      const text = await req.text();
      const res = JSON.parse(text);
      const standings: StandingsInterface = {
        position: apiData.data.standings[i].position,
        team: {
          name: res.team.name,
          logo: res.team.logo
        },
        matches: {
          played: apiData.data.standings[i].overall.games_played,
          wins: apiData.data.standings[i].overall.won,
          losses: apiData.data.standings[i].overall.lost,
          draws: apiData.data.standings[i].overall.draw
        },
        goals: {
          for: apiData.data.standings[i].overall.goals_scored,
          against: apiData.data.standings[i].overall.goals_against,
          difference: apiData.data.standings[i].overall.goals_diff
        },
        points: apiData.data.standings[i].points,
        result: apiData.data.standings[i].result,
        status: apiData.data.standings[i].status
      }
      this.setStandings(standings);
    }
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

export interface StandingsInterface {
  position: number,
  team: {
    name: String,
    logo: String
  },
  matches: {
    played: number,
    wins: number,
    losses: number,
    draws: number
  },
  goals: {
    for: number,
    against: number,
    difference: number
  },
  points: number,
  result: String,
  status: String
}
