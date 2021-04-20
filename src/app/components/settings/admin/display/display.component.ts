import { Component, OnInit } from '@angular/core';
import { CommService } from 'src/app/services/comm/comm.service';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-display',
  templateUrl: './display.component.html',
  styleUrls: ['./display.component.scss']
})
export class DisplayComponent implements OnInit {

  openTab: string = 'Users';
  rowsInTable: number = 14;

  usersArray: string[][] = [];
  userPages: number[] = [];
  userTemplate: string[] = ['First name','Last name','Email','Admin','Created at','Updated at','Profile image','Google ID','Facebook ID','Amazon ID','Safe import','Edit import'];

  teamsArray: string[][] = [];
  teamPages: number[] = [];
  teamTemplate: string[] = ['Name', 'Team id', 'Short code', 'Logo', 'Country', 'Continent', 'League', 'Season start date', 'Season end date'];

  leaguesArray: string[][] = [];
  leaguePages: number[] = [];
  leagueTemplate: string[] = ['Name'];

  countriesArray: string[][] = [];
  countryPages: number[] = [];
  countryTemplate: string[] = ["Name", "Code", "Continent"];

  startLimit: number = 0;
  endLimit: number = this.rowsInTable;

  constructor(private comm: CommService) { }

  ngOnInit(): void { this.updateArray(); }

  async getNumberOfRows() {
    const req = await fetch(`${environment.db}/update.php`, {
      method: 'POST',
      body: this.comm.createFormData('COUNT', this.openTab.toLowerCase())
    });
    const res = await req.text();
    const pages = Math.ceil(Number(res) / this.rowsInTable);

    if(this.openTab === 'Users') this.userPages = Array(pages).fill(0).map((x,i)=>i);
    else if(this.openTab === 'Teams') this.teamPages = Array(pages).fill(0).map((x,i)=>i);
    else if(this.openTab === 'Leagues') this.leaguePages = Array(pages).fill(0).map((x,i)=>i);
    else if(this.openTab === 'Countries') this.countryPages = Array(pages).fill(0).map((x,i)=>i);
  }

  async fetchData() {
    const limit = JSON.stringify({ "start": this.startLimit, "end": this.endLimit });
    const req = await fetch(`${environment.db}/update.php`, {
      method: 'POST',
      body: this.comm.createFormData(`GET_${this.openTab.toUpperCase()}`, limit)
    });
    const res = await req.text();

    const array: string[][] = JSON.parse(res).data;

    let newArray = [];

    for(let i = 0; i < array.length; i++)
      newArray.push(this.setupArray(this.openTab, array[i]));

    if(this.openTab === 'Users') {
      this.usersArray = newArray;
      this.usersArray.unshift(this.userTemplate);
      this.orderArray(this.usersArray);
    } else if(this.openTab === 'Teams') {
      this.teamsArray = newArray;
      this.teamsArray.unshift(this.teamTemplate);
      this.orderArray(this.teamsArray);
    } else if(this.openTab === 'Leagues') {
      this.leaguesArray = newArray;
      this.leaguesArray.unshift(this.leagueTemplate);
      this.orderArray(this.leaguesArray);
    } else if(this.openTab === 'Countries') {
      this.countriesArray = newArray;
      this.countriesArray.unshift(this.countryTemplate);
      this.orderArray(this.countriesArray);
    }
  }

  setupArray(type: string, array: string[]) {

    let newArray: string[] = [];

    for(let i = 0; i < array.length; i++) {
      if(Number(array[i]) === 0 && array[i]) newArray.push('False');
      else if(Number(array[i]) === 1) newArray.push('True');
      else newArray.push(array[i]);
    }

    return newArray;
  }

  orderArray(array: string[][]) {
    let arrayLength = 0;
    let subArrayLength = 0;
    let cellArrayLength = 0;

    for(let i = 0; i < array.length; i++) {
      if(array[i].length < 5) {
        cellArrayLength = 5 - array[i].length;
        for(let m = 0; m < cellArrayLength; m++)
        array[i].push('');
      }
      if(array.length < 15) {
        arrayLength = 15 - array.length;
        for(let n = 0; n < arrayLength; n++)
        array.push([]);
      }
      if(subArrayLength < array[i].length) subArrayLength = array[i].length;
      else {
        let thisArrayLength = array[i].length;
        for(let k = 0; k < subArrayLength - thisArrayLength; k++) {
          array[i].push('');
        }
      }
    }
  }

  editArray(type: string, e: any) { }

  trackByFn(index: number) { return index; }
  tabChanged(e: any) { this.openTab = e.tab.textLabel; }

}
