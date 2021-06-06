import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LeagueService {

  $openLeague: BehaviorSubject<string>;

  constructor() { this.$openLeague = new BehaviorSubject<string>(''); }

  setOpenLeague(newValue: string): void { this.$openLeague.next(newValue); }
  getOpenLeague(): Observable<string> { return this.$openLeague.asObservable(); }

}
