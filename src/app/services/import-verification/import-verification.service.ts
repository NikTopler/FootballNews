import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ImportVerificationService {

  constructor() { }

  importValidation(type: string, func: any, array: string[][]) {
    let errArray: string[] = [];
    for(let i = 0; i < array.length; i++) {
      for(let j = 0; j < array[i].length; j++) {
        if(i === 0) {
          if(!this.headerImport(type, array[i][j]))
            errArray.push(i + '-' + j);
        }
        else errArray = func(array[i][j], i, j, errArray);
      }
    }
    return errArray;
  }

}
