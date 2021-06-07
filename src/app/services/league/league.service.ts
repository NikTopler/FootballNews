import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment} from '../../../environments/environment';
import { CommService } from '../comm/comm.service';

@Injectable({
  providedIn: 'root'
})
export class LeagueService {

  openLeague: string = '';

  $openLeague: BehaviorSubject<string>;
  $players: BehaviorSubject<any[]>;
  $allTeams: BehaviorSubject<any[]>;

  constructor(private comm: CommService) {
    this.$openLeague = new BehaviorSubject<string>('');
    this.$players = new BehaviorSubject<any[]>([]);
    this.$allTeams = new BehaviorSubject<any[]>([]);
  }

  setOpenLeague(newValue: string): void { this.$openLeague.next(newValue); }
  getOpenLeague(): Observable<string> { return this.$openLeague.asObservable(); }

  setPlayers(newValue: any[]): void { this.$players.next(newValue); }
  getPlayers(): Observable<any[]> { return this.$players.asObservable(); }

  setAllTeams(newValue: any[]): void { this.$allTeams.next(newValue); }
  getAllTeams(): Observable<any[]> { return this.$allTeams.asObservable(); }

}
