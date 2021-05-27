import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommService {

  $isLoaded: BehaviorSubject<boolean>;

  constructor() { this.$isLoaded = new BehaviorSubject<boolean>(false); }

  setIsLoaded(newValue: boolean): void { this.$isLoaded.next(newValue); }
  getIsLoaded(): Observable<boolean> { return this.$isLoaded.asObservable(); }

  createFormData(word: string, values: string) {
    let formData = new FormData;
        formData.append(word, values);
    return formData;
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
