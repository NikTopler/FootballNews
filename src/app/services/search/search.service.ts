import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  suggestionArray: string[] = [];

  constructor() { }

  async suggestWords(query: string) {
    const res = await fetch(`https://openrefine-wikidata.toolforge.org/en/suggest/entity?prefix=${query}`)
    const json = await res.json();
    this.suggestionArray = [];
    let isNew = true;

    for(let i = 0; i < (json.result.length >= 7 ? 7 : json.result.length); i++) {
      for(let j = 0; j < this.suggestionArray.length; j++)
        if(json.result[i].name === this.suggestionArray[j]) {
          isNew = false;
          break;
        } else isNew = true;
      if(isNew && !json.result[i].name.toLowerCase().includes('category:')) this.suggestionArray.push(json.result[i].name);
    }
    return true;
  }
}
