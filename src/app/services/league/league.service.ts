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
  leaguesOptions: LeaguesOptions[] = [
    { name: 'matches', active: false },
    { name: 'news', active: false },
    { name: 'standings', active: false },
    { name: 'stats', active: false },
    { name: 'players', active: false },
  ];
  season: string = '';
  leagues: League[] = [];
  activeLeague: League = {id: null, name: null, seasons: []};
  activeSeason: Season = {id: null, start: '', end: '', name: '', active: false, standings: [], teams: [], players: []};

  $openLeague: BehaviorSubject<string>;
  $leaguesOptions: BehaviorSubject<any[]>;
  $activeSeason: BehaviorSubject<Season>;
  $allSeasons: BehaviorSubject<AllSeasons[]>;

  $activeLeague:BehaviorSubject<League>;

  $players: BehaviorSubject<any[]>;
  $allMatches: BehaviorSubject<any[]>;
  $news: BehaviorSubject<any[]>;

  constructor(private comm: CommService, private router: Router) {
    router.events.subscribe(() => this.setActivePage());
    this.$openLeague = new BehaviorSubject<string>('');
    this.$leaguesOptions = new BehaviorSubject<any[]>(this.leaguesOptions);
    this.$activeLeague = new BehaviorSubject<League>({id: null, name: null, seasons: []});
    this.$allSeasons = new BehaviorSubject<AllSeasons[]>([]);
    this.$activeSeason = new BehaviorSubject<Season>({ id: null, start: '', end: '', name: '', active: false, standings: [], teams: [], players: [] });

    this.$players = new BehaviorSubject<any[]>([]);
    this.$allMatches = new BehaviorSubject<any[]>([]);
    this.$news = new BehaviorSubject<any[]>([]);
  }

  setOpenLeague(newValue: string): void { this.$openLeague.next(newValue); }
  getOpenLeague(): Observable<string> { return this.$openLeague.asObservable(); }

  setLeagueOptions(newValue: any[]): void { this.$leaguesOptions.next(newValue); }
  getLeagueOptions(): Observable<any[]> { return this.$leaguesOptions.asObservable(); }

  setPlayers(newValue: any[]): void { this.$players.next(newValue); }
  getPlayers(): Observable<any[]> { return this.$players.asObservable(); }

  setActiveLeague(newValue: League): void { this.$activeLeague.next(newValue); }
  getActiveLeague(): Observable<League> { return this.$activeLeague.asObservable(); }

  setAllSeasons(newValue: AllSeasons[]): void { this.$allSeasons.next(newValue); }
  getAllSeasons(): Observable<AllSeasons[]> { return this.$allSeasons.asObservable(); }

  setActiveSeason(newValue: Season): void { this.$activeSeason.next(newValue); }
  getActiveSeason(): Observable<Season> { return this.$activeSeason.asObservable(); }

  setMatches(newValue: any[]): void { this.$allMatches.next(newValue); }
  getMatches(): Observable<any[]> { return this.$allMatches.asObservable(); }

  setNews(newValue: any[]): void { this.$news.next(newValue); }
  getNews(): Observable<any[]> { return this.$news.asObservable(); }

  async fetchLeagues() {
    const req = await fetch(`${environment.db}/leagues.php`, {
      method: 'POST',
      body: this.comm.createFormData('LEAGUE_DATA', '')
    });
    const text = await req.text();
    const res = JSON.parse(text);
    if(!res) return;

    this.leagues = res.data;

    this.setupLeagues();
    this.setupActiveSeason(null);
    this.setupAllSeasons();
  }

  setupLeagues() {
    const activeLeague = this.leagues.filter(league => { return league.name == this.comm.leagueNameChange(this.openLeague) })[0];
    this.setActiveLeague(activeLeague);
    this.activeLeague = activeLeague;
  }

  setupActiveSeason(name: string | null) {
    if(name) this.activeSeason = this.activeLeague.seasons.filter(season => { return season.name === name })[0];
    else this.activeSeason = this.activeLeague.seasons.filter(season => { return season.active })[0];
    this.setActiveSeason(this.activeSeason);
    this.setupPlayers();
  }

  setupAllSeasons() {
    this.setAllSeasons([]);
    let array = [];
    for(let i = 0; i < this.activeLeague.seasons.length; i++)
      array.push({name: `20${this.activeLeague.seasons[i].name}`, active: this.activeLeague.seasons[i].active });
    array.sort((a, b) => (a.name < b.name) ? 1 : -1);
    this.setAllSeasons(array);
  }

  setupPlayers() {
    if(this.activeSeason.players.length === 0) this.setPlayers(this.activeLeague.seasons[1].players);
    else this.setPlayers(this.activeSeason.players);
  }

  async fetchMatches() {
    // const req = await fetch('https://app.sportdataapi.com/api/v1/soccer/matches?apikey=9751a990-86f0-11eb-a0c8-6b846512b7c7&season_id=352&date_from=2020-09-19');
    // const res = await req.json();
    // this.setMatches(res.data);
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

export interface League {
  id: number | null,
  name: string | null,
  seasons: Season[]
}

export interface Season {
  id: number | null,
  start: string,
  end: string,
  name: string,
  active: boolean,
  standings: Standing[],
  teams: Team[],
  players: Player[]
}

export interface Standing {
  position: number | null,
  team: {
    name: String | null,
    logo: String | null
  },
  matches: {
    played: number,
    wins: number,
    losses: number,
    draws: number
  },
  goals: {
    for: number | null,
    against: number | null,
    difference: number | null
  },
  points: number | null,
  result: string,
  status: string
}

export interface Player {
  position: number | null,
  player: {
    id: number | null,
    name: string,
    image: string | null
  },
  team: Team,
  minutes_played: number,
  substituted_in: number | null
  goals: {
    away: number | null,
    home: number | null,
    overall: number | null
  },
  penalties: number
}

export interface Team {
  id: number,
  name: string,
  shortCode: string,
  logo: string
}

export interface LeaguesOptions {
  name: string,
  active: boolean
}

export interface AllSeasons {
  name: string,
  active: boolean
}
