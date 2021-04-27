import { Clipboard } from '@angular/cdk/clipboard';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EditorService {

  activeArray: string[] = [];
  copyArray: string[] = [];

  userTemplate: string[] = ['firstName','lastName','email','admin','createdAt','updatedAt','profileImage','googleID','facebookID','amazonID','safeImport','editImport'];
  teamTemplate: string[] = ['name', 'teamID', 'shortCode', 'logo', 'country', 'continent', 'league', 'seasonStartDate', 'seasonEndDate'];
  leagueTemplate: string[] = ['name'];
  countryTemplate: string[] = ['name', 'code', 'continent'];

  constructor(private clipboard: Clipboard) { }

  orderDoubleArray(type: string, array: string[][]) {
    this.copyArray = this.arrayToJSON(type, array);
    if(type === 'Users') this.activeArray = this.multidimensionalArrayToString(this.userTemplate, array);
    else if(type === 'Teams') this.activeArray = this.multidimensionalArrayToString(this.teamTemplate, array);
    else if(type === 'Leagues') this.activeArray = this.multidimensionalArrayToString(this.leagueTemplate, array);
    else if(type === 'Countries') this.activeArray = this.multidimensionalArrayToString(this.countryTemplate, array);
  }

  multidimensionalArrayToString(template: string[], array: string[][]) {
    let jsonArray: any[] = [['[']];
    let pushCounter: number = 1;
    let whiteSpace: string[] = this.createWhiteSpace([], pushCounter);

    for(let i = 0; i < array.length; i++) {
        jsonArray.push([whiteSpace.join(''), '{']);
        pushCounter += 1;

      for(let j = 0; j < array[i].length; j++) {
        let comma = array[i].length !== j + 1 ? ',' : '';
        whiteSpace = this.createWhiteSpace([], pushCounter);
        jsonArray.push([whiteSpace.join(''), `"${template[j]}"`, `: "${array[i][j]}"${comma}`]);
      }

      if(i === array.length - 1) jsonArray.push([whiteSpace.join(''), '}'], [']']);
      else jsonArray.push([whiteSpace.join(''), '},']);

      pushCounter = 1;
      whiteSpace = this.createWhiteSpace([], pushCounter);
    }
    return jsonArray;
  }

  createWhiteSpace(array: string[], num: number) {
    for(let i = 0; i < num; i++)
      array.push('');
    return array;
  }

  arrayToJSON(type: string, array: string[][]) {

    let template: string[] = [];
    let newArray: string[] = [];
    let row: string = '';
    let comma: string = '';
    let qoute: string = '';

    if(type === 'Users') template = this.userTemplate;
    else if(type === 'Teams') template = this.teamTemplate;
    else if(type === 'Leagues')  template = this.leagueTemplate;
    else if(type === 'Countries') template = this.countryTemplate;

    for(let i = 0; i < array.length; i++) {
      row = `{`;
      for(let j = 0; j < template.length; j++) {
        if(j + 1 === template.length) comma = '';
        else comma = ',';

        if(Number(array[i][j]) || array[i][j] === '0' || array[i][j] === null) qoute = '';
        else qoute = '"';

        row += `"${template[j]}": ${qoute+array[i][j]+qoute+comma}`;
      }

      if(i + 1 === array.length) comma = '';
      else comma = ',';

      row += `}${comma}`;
      newArray.push(row);
    }
    return newArray;
  }

  copyToClipboard() { this.clipboard.copy(`[${this.copyArray.join('')}]`); }
}
