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

  data: string[][] = [];

  typeOfImport: string = 'team';


  constructor(private userService: UserService ) { }
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
