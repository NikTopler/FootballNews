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

  teamFormStructure = [
    ['team name', 'team', 'name'],
    ['team id', 'team_id', 'teamid', 'id'],
    ['short code', 'short_code'],
    ['logo'],
    ['country', 'countries'],
    ['continent', 'continents'],
    ['league', 'leagues'],
    ['start', 'season start', 'season start date'],
    ['end', 'season end', 'season end date'],
  ];

  headerImport(type: string, word: string) {

    let structureArray: string[][] = [];
    let check: boolean = false;

    if(type === 'USERS') structureArray = this.userFormStructure;
    else if(type === 'TEAMS') structureArray = this.teamFormStructure;

    for(let n = 0; n < structureArray.length; n++)
      for(let m = 0; m < structureArray[n].length; m++)
        if(word.toLowerCase() === structureArray[n][m]) {
          check = true;
        }
    return check;
  }

  importValidation(type: string, func: any, array: string[][]) {

    let resMessage: responseMessage = { 'code': 200, 'message': '', 'body': [] }
    let errArray: string[] = [];
    let arrayInnerSize: number = array[0].length;
    let emptyFields: boolean = false;
    let notEmptyArray: boolean = false;

    for(let i = 0; i < array.length; i++) {

      if(array[i].length !== arrayInnerSize && array[i].length === 0) continue;
      else if(array[i].length !== arrayInnerSize) {
        for(let k = 0; k < arrayInnerSize; k++)
          errArray.push(i + '-' + k);
        emptyFields = true;
      }

      for(let j = 0; j < array[i].length; j++) {
        if(i === 0) {
          if(!this.headerImport(type, array[i][j])) {
            resMessage.code = 404;
            resMessage.message = 'Wrong import type, check the template!';
            return resMessage;
          }
        } else {
          if(array[i][j].trim().length !== 0) notEmptyArray = true;
          errArray = func(array[i][j], i, j, errArray);
        }
      }
    }

    if(!notEmptyArray) {
      resMessage.code = 204;
      resMessage.message = `Cannot import empty array!`;
    }
    else if(errArray.length !== 0 && !emptyFields) resMessage.message = `Wrong values inserted into the table!`
    else if(emptyFields) resMessage.message = `All columns in a row must be full!`;

    resMessage.body = errArray;
    return resMessage;
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

  teamValidation = (word: string, i: number, j: number, errArray: string[]) => {
    if((j === 0 || j === 2 || j === 4 || j === 5 || j === 6) && !this.authenticationService.firstLastName(word))
      errArray.push(i + '-' + j);
    else if(j === 1 && !Number(word))
      errArray.push(i + '-' + j);
    else if((j === 7 || j === 8) && !this.authenticationService.checkDate(word.trim()))
      errArray.push(i + '-' + j);
    return errArray;
  }

}

export interface responseMessage {
  code: number,
  message: string,
  body: string[]
}

