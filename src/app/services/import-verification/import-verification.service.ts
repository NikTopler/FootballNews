import { Injectable } from '@angular/core';
import { AuthenticationService } from '../authentication/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class ImportVerificationService {

  constructor(private authenticationService: AuthenticationService) { }

  userFormStructure = [
    ['first name', 'firstname'],
    ['last name', 'lastname', 'surname'],
    ['mail', 'email', 'gmail'],
    ['admin'],
    ['image', 'profile img', 'profileimg', 'profile image']
  ];

  headerImport(type: string, word: string) {

    let structureArray: string[][] = [];

    if(type === 'USERS') structureArray = this.userFormStructure;

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

  userValidation = (word: string, i: number, j: number, errArray: string[]) => {
    if((j === 0 || j === 1) && !this.authenticationService.firstLastName(word))
      errArray.push(i + '-' + j);
    else if(j === 2 && !this.authenticationService.validateEmail(word))
      errArray.push(i + '-' + j);
    else if(j === 3 &&
        (word.toLowerCase() !== 'true'
      && word.toLowerCase() !== 'false') &&
        (word !== '0' && word !== '1'))
      errArray.push(i + '-' + j);

    return errArray;
  }
}
