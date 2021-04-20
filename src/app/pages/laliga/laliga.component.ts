import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

@Component({
  selector: 'app-laliga',
  templateUrl: './laliga.component.html',
  styleUrls: ['./laliga.component.scss']
})
export class LaligaComponent implements OnInit {

  array: any;
  top:any;
  news:any;
  date1 = new FormControl(new Date())
  constructor(private http: HttpClient) { }

  ngOnInit() {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    var tomorrow = new Date(today.setDate(today.getDate() + 3));
    var td = String(tomorrow.getDate()).padStart(2, '0');
    var tm = String(tomorrow.getMonth() + 1).padStart(2, '0'); //January is 0!
    var ty = tomorrow.getFullYear();


    var start_date = yyyy + "-" + mm + "-" + dd;
    var end_date = ty + "-" + tm + "-" + td;

   /*let res = this.http.get("https://app.sportdataapi.com/api/v1/soccer/matches?apikey=2f2b7820-86f4-11eb-b165-0792cfd2240a&season_id=1511&date_from="+start_date+"&date_to="+end_date+"");
    res.subscribe((data) => {
      this.array = data;
      this.array = this.array.data;
    });


    let a = this.http.get("https://app.sportdataapi.com/api/v1/soccer/topscorers?apikey=2f2b7820-86f4-11eb-b165-0792cfd2240a&season_id=1511");
    a.subscribe((data) => {
      this.top = data;
      this.top = this.top.data.slice(0,8);
    })*/


    let url = "https://newsapi.org/v2/everything?q=la%20liga&sortBy=popularity&apiKey=b25fa1c7df0c478984b760f83b18d9a5";

    let rey = this.http.get(url)
    rey.subscribe(data => {
      this.news = data;
      this.news = this.news.articles.slice(0,4);
      console.log(data);
    })

  }

  events: string[] = [];


  addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
    this.array=null;
    this.events = [];
    this.events.push(`${type}: ${event.value}`);
    var s_date = this.events[0].slice(11, 23);



    var e_date = new Date (s_date);
    var t_date = new Date(e_date.setDate(e_date.getDate()+1));
    var dd = String(t_date.getDate()).padStart(2, '0');
    var mm = String(t_date.getMonth() + 1).padStart(2, '0');
    var yyyy =  t_date.getFullYear();

    var end = yyyy + "-" + mm + "-" + dd;

    let rea = this.http.get("https://app.sportdataapi.com/api/v1/soccer/matches?apikey=2f2b7820-86f4-11eb-b165-0792cfd2240a&season_id=1511&date_from="+s_date+"&date_to="+end+"");
    rea.subscribe((data) => {
      this.array = data;
      this.array = this.array.data;
    });


  }

}
