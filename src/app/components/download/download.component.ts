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
  headerDownloadText: string | null = null;
  headerImportText: string | null = null;

  allArray: downloadArray[] = [];

  constructor(
    private downloadService: DownloadService) {
    this.downloadService.getHeader()
      .subscribe((val) => {
        if(val) this.updateHeaderText();
        this.setupArray(this.downloadService.downloadsArray);
        this.setupArray(this.downloadService.importsArray);
      })
  }

  setupArray(array: downloadArray[]) {
    let isInside = false;
    let newArray: downloadArray[] = this.allArray;
    for(let i = 0; i < array.length; i++) {
      for(let j = 0; j < newArray.length; j++)
        if(newArray[j].id === array[i].id)
          isInside = true;
      if(newArray.length === 0 || !isInside)
        this.allArray.push(array[i]);
      isInside = false;
    }
  }

  transformArrayToXLSX(type: string, array: string[][]) {
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(array);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, type);
    XLSX.writeFile(wb, `${type}.xlsx`);
  }

  close(): void {
    this.downloadService.downloadsArray = [];
    this.downloadService.finishedDownloads = [];
    this.downloadService.importsArray = [];
    this.downloadService.finishedImports = [];
    this.downloadService.setIsOpen(false);
  }

  updateHeaderText() {
    const allDownloadInteractions = this.downloadService.downloadsArray.length;
    const finishedDownloadInteractions = this.downloadService.finishedDownloads.length;
    const allImportInteractions = this.downloadService.importsArray.length;
    const finishedImportInteractions = this.downloadService.finishedImports.length;

    if(allDownloadInteractions !== 0)
      this.headerDownloadText = `${finishedDownloadInteractions} of ${allDownloadInteractions} downloads completed`;
    else this.headerDownloadText = null;

    if(allImportInteractions !== 0)
      this.headerImportText = `${finishedImportInteractions} of ${allImportInteractions} imports completed`;
    else this.headerImportText = null;
  }
}

export interface downloadArray  {
  id: number,
  text: string,
  finished: boolean
}
