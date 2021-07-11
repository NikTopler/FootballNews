import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AllSeasons } from '../league/league.service';

@Injectable({
  providedIn: 'root'
})
export class CommService {

  months: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  $isLoaded: BehaviorSubject<boolean>;
  $waitForResponse: BehaviorSubject<boolean>;

  $openExternalLogin: BehaviorSubject<boolean>;
  $slp: BehaviorSubject<boolean>;

  constructor(private router: Router) {
    this.$isLoaded = new BehaviorSubject<boolean>(false);
    this.$waitForResponse = new BehaviorSubject<boolean>(false);
    this.$openExternalLogin = new BehaviorSubject<boolean>(false);
    this.$slp = new BehaviorSubject<boolean>(false);
  }

  setIsLoaded(newValue: boolean): void { this.$isLoaded.next(newValue); }
  getIsLoaded(): Observable<boolean> { return this.$isLoaded.asObservable(); }

  setWaitForResponse(newValue: boolean): void { this.$waitForResponse.next(newValue); }
  getWaitForResponse(): Observable<boolean> { return this.$waitForResponse.asObservable(); }

  setExternalLogin(newValue: boolean): void { this.$openExternalLogin.next(newValue); }
  getExternalLogin(): Observable<boolean> { return this.$openExternalLogin.asObservable(); }

  setSlp(newValue: boolean): void { this.$slp.next(newValue); }
  getSlp(): Observable<boolean> { return this.$slp.asObservable(); }

  createFormData(word: string, values: string) {
    let formData = new FormData;
        formData.append(word, values);
    return formData;
  }

  leagueNameChange(league: string) {
    if(league.includes('laliga')) return 'Laliga';
    else if(league.includes('premier')) return 'Premier League';
    return '';
  }

  changeOption(text: string, id: string, array: AllSeasons[], selectOpen: boolean) {
    for(let i = 0; i < array.length; i++)
      if(array[i].name === text.trim()) array[i].active = true;
      else array[i].active = false;
    this.manageSelect(id, selectOpen);
  }

  manageSelect(id: string, selectOpen: boolean) {
    const expandContainer = this.getSelectContainer(id).querySelector('.select-expand') as HTMLDivElement;

    if(selectOpen) expandContainer.classList.add('active');
    else expandContainer.classList.remove('active');
  }

  getSelectContainer(id: string) { return document.getElementById(id) as HTMLDivElement; }

  setupDate(date: string) {
    const array = [... date];
    const year = Number(array[0]+array[1]+array[2]+array[3]);
    const month = Number(array[5]+array[6]);
    const day = array[8]+array[9];
    return `${day}${[... day][[... day].length-1] === '1' ? 'st' : [... day][[... day].length-1] === '2' ? 'nd' : [... day][[... day].length-1] === '3' ? 'rd' : 'th'} ${this.months[month-1]} ${year}`;
  }

  addActiveClass(following: any, name: string) {
    if(!following) return '';
    for(let i = 0; i < following.length; i++)
      if(following[i].name === name)
        return 'active';
    return '';
  }

  convertToDate(num: string | number) {
    const number = Number(num);
    const currentdate = new Date(1000 * number);
    return ((currentdate.getDate() > 9) ? currentdate.getDate() : '0' + currentdate.getDate()) + '-' +
          (((currentdate.getMonth()+1) > 9) ? (currentdate.getMonth()+1) : '0' + (currentdate.getMonth()+1)) + '-' +
          currentdate.getFullYear() + ' ' +
          ((currentdate.getHours() > 9) ? currentdate.getHours() : '0' + currentdate.getHours()) + ':' +
          ((currentdate.getMinutes() > 9) ? currentdate.getMinutes() : '0' + currentdate.getMinutes()) + ':' +
          ((currentdate.getSeconds() > 9) ? currentdate.getSeconds() : '0' + currentdate.getSeconds());
  }

  async getAllLeagues() {

    let allLeagues = [];

    const req = await fetch(`${environment.db}/update.php`, {
      method: 'POST',
      body: this.createFormData('GET_LEAGUES', '')
    });
    const res = await req.text();
    const leagues: string[][] = JSON.parse(res).data;

    for(let i = 0; i < leagues.length; i++) {
      let path = '';

      if(leagues[i][0].toLowerCase() === 'laliga') path = 'laliga';
      else if(leagues[i][0].toLowerCase() === 'premier league') path = 'premier-league';

      allLeagues.push({ name: leagues[i][0], path: path });
    }

    return allLeagues;
  }
}

export interface Leagues {
  name: string,
  path: string
}

export interface Following {
  name: string,
  time: number
}
