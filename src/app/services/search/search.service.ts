import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CommService } from '../comm/comm.service';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  suggestionArray: string[] = [];
  $searchArticleArray: BehaviorSubject<any[]>;

  constructor(private comm: CommService) { this.$searchArticleArray = new BehaviorSubject<any[]>([]); }

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
    word = word.replace(/\s/g, '+')

    const req = await fetch(`${environment.db}/news.php`, {
      method: 'POST',
      body: this.comm.createFormData('SEARCH', `https://newsapi.org/v2/everything?q=${word}&apiKey=${environment.newsAPI}`)
    });
    const text = await req.text();
    const res = JSON.parse(text);

    if(res.status === 'ok') {
      const articles = JSON.parse(res.search).articles;
      this.setsearchArticleArray(articles);
    }
  }
}
