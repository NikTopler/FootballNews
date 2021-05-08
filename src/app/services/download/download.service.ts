import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DownloadService {

  downloadsArray: customInterface[] = [];
  finishedDownloads: number[] = [];

  importsArray: customInterface[] = [];
  finishedImports: number[] = []

  $isOpen: BehaviorSubject<boolean>;
  $changeHeader: BehaviorSubject<boolean>;

  constructor() {
    this.$changeHeader = new BehaviorSubject<boolean>(false);
    this.$isOpen = new BehaviorSubject<boolean>(false);
  }

  setHeader(newValue: boolean): void { this.$changeHeader.next(newValue); }
  getHeader(): Observable<boolean> { return this.$changeHeader.asObservable(); }

  setIsOpen(newValue: boolean): void { this.$isOpen.next(newValue); }
  getIsOpen(): Observable<boolean> { return this.$isOpen.asObservable(); }

  update(type: string, id: number) {
    let array: any;

    if(type === 'import') array = this.importsArray;
    else if(type === 'download')  array = this.downloadsArray;

    for(let i = 0; i < array.length; i++)
      if(array[i].id === id) {
        array[i].finished = true;
        break;
      }
  }
}

export interface customInterface {
  id: number,
  text: string,
  finished: boolean
}
