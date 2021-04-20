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

  async fetchData() {
  constructor(private comm: CommService) { }

  ngOnInit(): void { this.updateArray(); }

    const req = await fetch(`${environment.db}/update.php`, {
      method: 'POST',
      body: this.comm.createFormData('GET_USERS', '')
    });
    const res = await req.text();

    const array: string[][] = JSON.parse(res).data;
    this.usersArray = array;
    let newArray = [['First name',
                    'Last name',
                    'Email',
                    'Admin',
                    'Created at',
                    'Updated at',
                    'Profile image',
                    'Google ID',
                    'Facebook ID',
                    'Amazon ID',
                    'Safe import',
                    'Edit import']];

    for(let i = 1; i < array.length; i++)
      newArray.push(this.setupArray(this.openTab, array[i]));

      this.usersArray = newArray;
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

  editArray(type: string, e: any) { }

  trackByFn(index: number) { return index; }
  tabChanged(e: any) { this.openTab = e.tab.textLabel; }

}
