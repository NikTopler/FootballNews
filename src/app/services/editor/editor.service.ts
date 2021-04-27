import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EditorService {

  activeArray: string[] = [];

  userTemplate: string[] = ['firstName','lastName','email','admin','createdAt','updatedAt','profileImage','googleID','facebookID','amazonID','safeImport','editImport'];
  teamTemplate: string[] = ['name', 'teamID', 'shortCode', 'logo', 'country', 'continent', 'league', 'seasonStartDate', 'seasonEndDate'];
  leagueTemplate: string[] = ['name'];
  countryTemplate: string[] = ['name', 'code', 'continent'];

  orderDoubleArray(type: string, array: string[][]) {
    if(type === 'Users') this.activeArray = this.multidimensionalArrayToJSON(this.userTemplate, array);
    else if(type === 'Teams') this.activeArray = this.multidimensionalArrayToJSON(this.teamTemplate, array);
    else if(type === 'Leagues') this.activeArray = this.multidimensionalArrayToJSON(this.leagueTemplate, array);
    else if(type === 'Countries') this.activeArray = this.multidimensionalArrayToJSON(this.countryTemplate, array);
  }

  multidimensionalArrayToJSON(template: string[], array: string[][]) {
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
}
