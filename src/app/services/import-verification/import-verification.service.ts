import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ImportVerificationService {

  constructor() { }
  headerImport(type: string, word: string) {

    let structureArray: string[][] = [];


    for(let n = 0; n < structureArray.length; n++)
      for(let m = 0; m < structureArray[n].length; m++)
        if(word.toLowerCase() === structureArray[n][m])
          return true;
    return false;
  }

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
