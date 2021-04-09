import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.scss']
})
export class ImportComponent {

  data: string[][] = [];

  typeOfImport: string = 'team';


  constructor() { }

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

  }
}
