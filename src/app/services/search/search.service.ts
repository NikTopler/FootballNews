import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  suggestionArray: string[] = [];
  $searchArticleArray: BehaviorSubject<any[]>;

  constructor() { this.$searchArticleArray = new BehaviorSubject<any[]>([]); }

  setsearchArticleArray(newValue: any[]): void { this.$searchArticleArray.next(newValue); }
  getsearchArticleArray(): Observable<any[]> { return this.$searchArticleArray.asObservable(); }

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

  async fetchNews(word: string) {
    const response = await fetch(`https://newsapi.org/v2/everything?q=${word}&apiKey=${environment.newsAPI}`);
    const json = await response.json();
    const articles = await json.articles;
    this.setsearchArticleArray(articles);
  }
}
