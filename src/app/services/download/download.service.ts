import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DownloadService {

  downloadsArray: downloadArray[] = [];

  constructor() { }
}

export interface downloadArray {
  text: string,
  finished: boolean
}
