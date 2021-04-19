import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormControl } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

@Component({
  selector: 'app-premiere-league',
  templateUrl: './premiere-league.component.html',
  styleUrls: ['./premiere-league.component.scss']
})
export class PremiereLeagueComponent implements OnInit {
  array: any;
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

    let res = this.http.get("https://app.sportdataapi.com/api/v1/soccer/matches?apikey=2f2b7820-86f4-11eb-b165-0792cfd2240a&season_id=352&date_from=" + start_date + "&date_to=" + end_date + "");
    res.subscribe((data) => {
      this.array = data;
      this.array = this.array.data;
    });
  }

  events: string[] = [];


  addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
    this.events = [];
    this.events.push(`${type}: ${event.value}`);
    var s_date = this.events[0].slice(11, 23);



    var e_date = new Date(s_date);
    var t_date = new Date(e_date.setDate(e_date.getDate() + 1));
    var dd = String(t_date.getDate()).padStart(2, '0');
    var mm = String(t_date.getMonth() + 1).padStart(2, '0');
    var yyyy = t_date.getFullYear();

    var end = yyyy + "-" + mm + "-" + dd;

    let res = this.http.get("https://app.sportdataapi.com/api/v1/soccer/matches?apikey=2f2b7820-86f4-11eb-b165-0792cfd2240a&season_id=352&date_from=" + s_date + "&date_to=" + end + "");
    res.subscribe((data) => {
      this.array = data;
      this.array = this.array.data;
    });
  }
}
