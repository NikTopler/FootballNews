import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user/user.service';
import { SettingsComponent } from '../../settings.component';
import { environment } from '../../../../../environments/environment';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.scss']
})
export class ImportComponent {

  userInfo: any = this.userService.userInfo;
  openTab: string = 'Users';

  usersArray: string[][] = [];
  teamsArray: string[][] = [];
  leaguesArray: string[][] = [];
  countriesArray: string[][] = [];

  userTemplateArray: string[][] = [
    ["First name", "Last name", "Email", "Admin", "Profile image"],
    ["Janez", "Novak", "janez.novak@gmail.com", "FALSE", "https://miro.medium.com/max/1838/1*mk1-6aYaf_Bes1E3Imhc0A.jpeg"],
    ["Mirko ", "Car", "mirko.car@gmail.com", "TRUE", "https://miro.medium.com/max/1838/1*mk1-6aYaf_Bes1E3Imhc0A.jpeg"]
  ];
  teamsTemplateArray: string[][] = [
    ["Name", "Team id", "Short code", "Logo", "Country", "League", "Season start date", "Season end date"],
    ["Atletico Madrid ", "6406", "ATM", "https://cdn.sportdataapi.com/images/soccer/teams/100/107.png", "Spain", "Laliga", "9/13/20", "5/24/21"],
    ["FC Barcelona", "6404", "FCB", "https://cdn.sportdataapi.com/images/soccer/teams/100/99.png", "Spain", "Laliga", "9/13/20", "5/24/21"],
    ["Real Madrid", "6402", "RM", "https://cdn.sportdataapi.com/images/soccer/teams/100/113.png", "Spain", "Laliga", "9/13/20", "5/24/21"]
  ];
  leaguesTemplateArray: string[][] = [
    ["Name"],
    ["Laliga"],
    ["Premier League"]
  ];
  countriesTemplateArray: string[][] = [
    ["Name", "Code", "Continent"],
    ["Slovenia", "SVN", "Europe"],
    ["Slovakia", "SLO", "Europe"]
  ];

  constructor(
    private userService: UserService,
    private settingsComponent: SettingsComponent) { }

  test(event: any) {
    const target: DataTransfer = <DataTransfer>(event.target);
    if(target.files.length !== 1) return console.log('lenght not 1');

    const reader: FileReader = new FileReader();

    reader.onload = (e: any) => {

      const result: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(result, { type: 'binary' });
      const wName: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wName];

      this.data = (XLSX.utils.sheet_to_json(ws, { header: 1, raw: false }));

      if(this.typeOfImport === 'team') {
        if(this.data[0]) {

        }
      }

    }

    reader.readAsBinaryString(target.files[0]);

  tabChanged(e: any) { this.openTab = e.tab.textLabel; }
  openFileManager(e: any) { e.target.parentElement.querySelector('input').click(); }
  }
}
