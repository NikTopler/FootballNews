import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DownloadService {

  downloadsArray: downloadArray[] = [];
  finishedDownloads: number[] = [];
  changeHeader: BehaviorSubject<boolean>;

  constructor() { this.changeHeader = new BehaviorSubject<boolean>(false); }

  setHeader(newValue: boolean): void { this.changeHeader.next(newValue); }
  getHeader(): Observable<boolean> { return this.changeHeader.asObservable(); }
}

export interface downloadArray {
  id: number,
  text: string,
  finished: boolean
}
