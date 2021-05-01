import { Component, OnInit } from '@angular/core';
import { DownloadComponent } from 'src/app/components/download/download.component';
import { CommService } from 'src/app/services/comm/comm.service';
import { DownloadService } from 'src/app/services/download/download.service';
import { EditorService } from 'src/app/services/editor/editor.service';
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
  userOpenTable: boolean = true;
  userOpenJSON: boolean = false;
  userCopy: boolean = false;

  teamsArray: string[][] = [];
  teamPages: number[] = [];
  teamTemplate: string[] = ['Name', 'Team id', 'Short code', 'Logo', 'Country', 'Continent', 'League', 'Season start date', 'Season end date'];
  teamOpenTable: boolean = true;
  teamOpenJSON: boolean = false;
  teamCopy: boolean = false;

  leaguesArray: string[][] = [];
  leaguePages: number[] = [];
  leagueTemplate: string[] = ['Name'];
  leagueOpenTable: boolean = true;
  leagueOpenJSON: boolean = false;
  leagueCopy: boolean = false;

  countriesArray: string[][] = [];
  countryPages: number[] = [];
  countryTemplate: string[] = ["Name", "Code", "Continent"];
  countryOpenTable: boolean = true;
  countryOpenJSON: boolean = false;
  countryCopy: boolean = false;

  startLimit: number = 0;
  endLimit: number = this.rowsInTable;

  constructor(
    private comm: CommService,
    private downloadComponent: DownloadComponent,
    private downloadService: DownloadService,
    private editorService: EditorService) { }

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

  async fetchData(noLimit: boolean) {

    let startLimit: boolean | number = this.startLimit;
    let endLimit: boolean | number = this.endLimit;

    if(noLimit) {
      startLimit = false;
      endLimit = false;
    }

    const limit = JSON.stringify({ "start": startLimit, "end": endLimit });
    const req = await fetch(`${environment.db}/update.php`, {
      method: 'POST',
      body: this.comm.createFormData(`GET_${this.openTab.toUpperCase()}`, limit)
    });
    const res = await req.text();

    const array: string[][] = JSON.parse(res).data;

    let newArray = [];

    for(let i = 0; i < array.length; i++)
      newArray.push(this.setupArray(this.openTab, array[i]));

    if(noLimit) return newArray;
    else if(this.openTab === 'Users') {
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
    return this.editorService.orderDoubleArray(this.openTab, array);
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

  async updateArray() {
    await this.getNumberOfRows();
    await this.fetchData(false);
  }

  async download(type: string) {
    this.downloadService.setIsOpen(true);
    this.downloadService.setHeader(true);

    const id = Date.now();
    const fileName = `${type}_${id}`;
    const downloadsArray = this.downloadService.downloadsArray;

    downloadsArray.push({"id": id, "text": `${type.charAt(0).toUpperCase() + type.slice(1)} information download`, "finished": false });
    const array: any = await this.fetchData(true);
    await this.downloadComponent.transformArrayToXLSX(fileName, array);

    this.downloadService.update('download', id);
    this.downloadService.finishedDownloads.push(id);
    this.downloadService.setHeader(true);
  }

  update(type: string, array: string[][]) { }

  changePage(e: any, num: number) {

    const selectedDiv = e.target as HTMLDivElement;
    const selecedDivContainer = selectedDiv.parentElement as HTMLDivElement;

    for(let i = 0; i < selecedDivContainer.children.length; i++)
      if(selecedDivContainer.children[i].classList.contains('active'))
        selecedDivContainer.children[i].classList.remove('active');

    selectedDiv.classList.add('active');

    this.startLimit = num === 0 ? 0 : num * 13;
    this.endLimit = num === 0 ? this.rowsInTable : this.rowsInTable + num * 13;

    this.updateArray();
  }

  editArray(type: string, e: any) { }

  trackByFn(index: number) { return index; }
  async tabChanged(e: any) {
    this.openTab = e.tab.textLabel;
    const pageNumber = document.querySelector('.'+this.openTab) as HTMLDivElement;

    if(pageNumber) {
      const activePage = pageNumber.querySelector('.active') as HTMLDivElement;
      const num = Number(activePage.innerHTML);
      this.startLimit = num === 1 ? 0 : (num - 1) * 13;
      this.endLimit = num === 1 ? this.rowsInTable : this.rowsInTable + (num - 1) * 13;
    }

    await this.updateArray();
    this.startLimit = 0;
    this.endLimit = this.rowsInTable;
  }

  copy() { this.editorService.copyToClipboard(); }
}
