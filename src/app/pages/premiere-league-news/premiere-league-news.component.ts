import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-premiere-league-news',
  templateUrl: './premiere-league-news.component.html',
  styleUrls: ['./premiere-league-news.component.scss']
})
export class PremiereLeagueNewsComponent implements OnInit {
  news: any;
  constructor(private http: HttpClient) { }

  ngOnInit() {



    let url = "https://newsapi.org/v2/everything?q=barclays-premier-league&language=en&apiKey=b25fa1c7df0c478984b760f83b18d9a5";

    let res = this.http.get(url)
    res.subscribe(data => {
      this.news = data;
      this.news = this.news.articles;
    })
  }

}
