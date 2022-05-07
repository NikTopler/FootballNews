import { Clipboard } from '@angular/cdk/clipboard';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EditorService {

  activeArray: string[] = [];
  copyArray: string[] = [];
  $loading = new BehaviorSubject<boolean>(true);

  userTemplate: string[] = ['First name','Last name','Email','Admin','Created at','Updated at','Profile image','Google ID','Facebook ID','Amazon ID','Email Service','Safe import','Edit import'];
  teamTemplate: string[] = ['Name', 'Team ID', 'Short Code', 'Logo', 'Country', 'Continent'];
  leagueTemplate: string[] = ['Name'];
  countryTemplate: string[] = ['Name', 'Acronym', 'Continent'];

  constructor(private clipboard: Clipboard) { }

  getLoading() { return this.$loading.asObservable(); }
  setLoading(newVal: boolean) { this.$loading.next(newVal); }

  orderDoubleArray(type: string, array: string[][]) {
    this.setLoading(true);
    this.copyArray = this.arrayToJSON(type, array);
    if(type === 'Users') this.activeArray = this.multidimensionalArrayToString(this.userTemplate, array);
    else if(type === 'Teams') this.activeArray = this.multidimensionalArrayToString(this.teamTemplate, array);
    else if(type === 'Leagues') this.activeArray = this.multidimensionalArrayToString(this.leagueTemplate, array);
    else if(type === 'Countries') this.activeArray = this.multidimensionalArrayToString(this.countryTemplate, array);
    this.setLoading(false);
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
        let quote = Number(array[i][j]) || array[i][j] === '0' || array[i][j] === null ? '' : '"';

        whiteSpace = this.createWhiteSpace([], pushCounter);
        whiteSpace.push(`"${template[j]}"`, ':', quote+array[i][j]+quote, comma);
        jsonArray.push(whiteSpace);
      }

      whiteSpace = this.createWhiteSpace([], pushCounter - 1);

      if(i === array.length - 1) {
        whiteSpace.push('}');
        jsonArray.push(whiteSpace, [']']);
      } else {
        whiteSpace.push('},');
        jsonArray.push(whiteSpace);
      }
      pushCounter = 1;
      whiteSpace = this.createWhiteSpace([], pushCounter);
    }
    return jsonArray;
  }

  createWhiteSpace(array: string[], num: number) {
    for(let i = 0; i < num; i++)
      array.push('BREAK');
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
