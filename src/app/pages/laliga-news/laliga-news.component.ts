import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-laliga-news',
  templateUrl: './laliga-news.component.html',
  styleUrls: ['./laliga-news.component.scss']
})
export class LaligaNewsComponent implements OnInit {
  news: any;

  constructor(private http: HttpClient) { }

  async ngOnInit() {
    const url = "https://cors-anywhere.herokuapp.com/https://newsapi.org/v2/everything?q=la-liga&language=en&apiKey=b25fa1c7df0c478984b760f83b18d9a5";
    const response = await fetch(url);
    const json = await response.json();
    const articles = await json.articles;
    this.news = articles;
  }

}
