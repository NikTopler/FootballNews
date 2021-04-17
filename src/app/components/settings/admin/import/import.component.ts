import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user/user.service';
import { SettingsComponent } from '../../settings.component';
import { environment } from '../../../../../environments/environment';
import * as XLSX from 'xlsx';
import { CommService } from 'src/app/services/comm/comm.service';
import { ImportVerificationService } from 'src/app/services/import-verification/import-verification.service';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';

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
    ["Name", "Team id", "Short code", "Logo", "Country", "Continent", "League", "Season start date", "Season end date"],
    ["Atletico Madrid ", "6406", "ATM", "https://cdn.sportdataapi.com/images/soccer/teams/100/107.png", "Spain", "Europe", "Laliga", "09/13/2020", "05/24/2021"],
    ["FC Barcelona", "6404", "FCB", "https://cdn.sportdataapi.com/images/soccer/teams/100/99.png", "Spain", "Europe", "Laliga", "09/13/2020", "05/24/2021"],
    ["Real Madrid", "6402", "RM", "https://cdn.sportdataapi.com/images/soccer/teams/100/113.png", "Spain", "Europe", "Laliga", "09/13/2020", "05/24/2021"]
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
    private settingsComponent: SettingsComponent,
    private comm: CommService,
    private importVerifyService: ImportVerificationService,
    private authenticationService: AuthenticationService) { }

  checkFile(event: any) {

    const name = event.target.files[0].name;
    const extension = name.substr((name.lastIndexOf('.') +1));

    if(extension !== 'xlsx')
      return this.settingsComponent.createMessage(true, 'You can only upload .xlsx files!', 'err');

    this.readFile(event.target);
  }

  readFile(file: any) {
    const target: DataTransfer = <DataTransfer>(file);
    if(target.files.length !== 1) return console.log('lenght not 1');

    const reader: FileReader = new FileReader();

    reader.onload = (e: any) => {

      const result: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(result, { type: 'binary' });
      const wName: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wName];

      if(this.openTab === 'Users') {
        this.usersArray = (XLSX.utils.sheet_to_json(ws, { header: 1, raw: false }));
        this.orderArray(this.usersArray);
      }
      else if(this.openTab === 'Teams') {
        this.teamsArray = (XLSX.utils.sheet_to_json(ws, { header: 1, raw: false }));
        this.orderArray(this.teamsArray);
      }
      else if(this.openTab === 'Leagues'){
        this.leaguesArray = (XLSX.utils.sheet_to_json(ws, { header: 1, raw: false }));
        this.orderArray(this.leaguesArray);
      }
      else if(this.openTab === 'Countries') {
        this.countriesArray = (XLSX.utils.sheet_to_json(ws, { header: 1, raw: false }));
        this.orderArray(this.countriesArray);
      }
    }
    reader.readAsBinaryString(target.files[0]);
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

  resetArray(array: string[][]) {
    for(let i = 0; i < array.length; i++) {
      if(i === 0) continue;
      for(let j = 0; j < array[i].length; j++) {
        const input = document.getElementById(i+'-'+j) as HTMLInputElement;
        const container = input.parentElement as HTMLDivElement;;

        container.classList.remove('errInput');
        array[i][j] = '';
      }
    }
  }

  previewData(type: string, array: string[][]) {
    if(type === 'user') {
      this.usersArray = array;
      this.orderArray(this.usersArray);
    } else if(type === 'team') {
      this.teamsArray = array;
      this.orderArray(this.teamsArray);
    } else if(type === 'league') {
      this.leaguesArray = array;
      this.orderArray(this.leaguesArray);
    } else if(type === 'country') {
      this.countriesArray = array;
      this.orderArray(this.countriesArray);
    }
  }

  async importData(type: string, array: string[][]) {
    let newArray: any = [[]];
    for(let i = 0; i < array.length; i++) {
      for(let j = 0; j < array[i].length; j++)
        newArray[i] = array[i].filter(e => String(e).trim());
      if(array[i].length !== 0) newArray.push([]);
    }

    let func: any;
    if(type === 'USERS') func = this.importVerifyService.userValidation;
    else if(type === 'TEAMS') func = this.importVerifyService.teamValidation;
    else func = this.importVerifyService.leagueCountryValidation;

    const resMessage: responseMessage = this.importVerifyService.importValidation(type, func, newArray);

    if(resMessage.code === 404 || resMessage.code === 204) return this.settingsComponent.createMessage(true, resMessage.message, 'err');
    else if(resMessage.code === 200 && resMessage.body.length !== 0) return this.displayErrors(resMessage.message, resMessage.body);

    newArray = newArray.filter((e: string[]) => { return e.length !== 0 });

    const userValidation = await this.validateUser();

    if(!userValidation) return this.settingsComponent.createMessage(true, 'Something went wrong!', 'err')

    const userInfo = JSON.stringify({ "email": this.userInfo.email, "array": newArray });
    const req = await fetch(`${environment.db}/admin.php`, {
      method: 'POST',
      body: this.comm.createFormData(type, userInfo)
    });
    const res = await req.text();
    console.log(res)

    this.settingsComponent.createMessage(true, 'Values successfully imported into the database!', 'success');
  }

  async validateUser() {
    const res = await this.userService.validateUser();
    if(res.status === 401 && res.body.includes('Refresh'))
      return location.reload();
    else if(res.status === 401 && res.body.includes('Access'))
      return this.authenticationService.logout();
    else if(res.status === 404)
      this.validateUser();
    return true;
  }

  displayErrors(message: string, array: string[]): void {
    for(let i = 0; i < array.length; i++) {
      const id = array[i];
      const container = document.getElementById(id)?.parentElement as HTMLDivElement;
      container.classList.add('errInput');
    }
    this.settingsComponent.createMessage(true, message, 'err')
  }

  editArray(type: string, e: any): void {
    const input = e.target;
    const container = input.parentElement as HTMLDivElement;
    const value = e.target.value;
    const x =  input.id.split('-')[0];
    const y =  input.id.split('-')[1];

    if(type === 'users') this.usersArray[x][y] = value;
    else if(type === 'teams') this.teamsArray[x][y] = value;
    else if(type === 'leagues') this.leaguesArray[x][y] = value;
    else if(type === 'countries') this.countriesArray[x][y] = value;

    if(container.classList.contains('errInput')) container.classList.remove('errInput')
  }

  trackByFn(index: number) { return index; }

  tabChanged(e: any) { this.openTab = e.tab.textLabel; }
  openFileManager(e: any) { e.target.parentElement.querySelector('input').click(); }
  downloadTemplateFile(path: string) {
   const link = document.getElementById(path) as HTMLLinkElement;
   link.click();
  }
}

export interface responseMessage {
  code: number,
  message: string,
  body: string[]
}
