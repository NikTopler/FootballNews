import { Component, OnInit } from '@angular/core';
import { AppComponent } from 'src/app/app.component';
import { DownloadService } from 'src/app/services/download/download.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-download',
  templateUrl: './download.component.html',
  styleUrls: ['./download.component.scss']
})
export class DownloadComponent {

  open: boolean = false;
  downloadsOpen: boolean = true;
  rotateIcon: string = '';
  headerText: string = '0 of 1 downloads completed';

  downloadsArray: downloadArray[] = [];

  constructor(
    private appComponent: AppComponent,
    private downloadService: DownloadService) {
    this.downloadsArray = downloadService.downloadsArray;
    this.downloadService.getHeader()
      .subscribe((val) => { if(val) this.updateHeaderText() })
  }

  transformArrayToXLSX(type: string, array: string[][]) {
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(array);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, type);
    XLSX.writeFile(wb, `${type}.xlsx`);
  }

  close(): void {
    this.downloadService.downloadsArray = [];
    this.appComponent.downloadOpen = false;
  }

  updateHeaderText() {
    const allInteractions = this.downloadService.downloadsArray.length;
    const finishedInteractions = this.downloadService.finishedDownloads.length;

    this.headerText = `${finishedInteractions} of ${allInteractions} downloads completed`;
  }
}

export interface downloadArray {
  text: string,
  finished: boolean
}
