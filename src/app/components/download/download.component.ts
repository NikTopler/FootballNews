import { Component } from '@angular/core';
import { AppComponent } from 'src/app/app.component';
import { DownloadService } from 'src/app/services/download/download.service';

@Component({
  selector: 'app-download',
  templateUrl: './download.component.html',
  styleUrls: ['./download.component.scss']
})
export class DownloadComponent {

  open: boolean = false;
  downloadsOpen: boolean = true;
  rotateIcon: string = '';

  public downloadsArray: downloadArray[] = [];

  constructor(
    private appComponent: AppComponent,
    private downloadService: DownloadService) {
    this.downloadsArray = downloadService.downloadsArray;
  }

  transformArrayToXLSX(type: string, array: string[][]) { }

  close(): void {
    this.downloadService.downloadsArray = [];
    this.appComponent.downloadOpen = false;
  }
}

export interface downloadArray {
  text: string,
  finished: boolean
}
