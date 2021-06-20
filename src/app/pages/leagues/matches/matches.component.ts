import { Component } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { LeagueService } from 'src/app/services/league/league.service';

@Component({
  selector: 'app-matches',
  templateUrl: './matches.component.html',
  styleUrls: ['./matches.component.scss']
})
export class MatchesComponent {

  matches: any[] = [];
  events: string[] = [];
  date: string = '';
  start_date: string = '';
  end_date: string = '';

  league: string = '';

  constructor(private leagueService: LeagueService) {

    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();

    var tomorrow = new Date(today.setDate(today.getDate() + 3));
    var td = String(tomorrow.getDate()).padStart(2, '0');
    var tm = String(tomorrow.getMonth() + 1).padStart(2, '0');
    var ty = tomorrow.getFullYear();

    this.start_date = yyyy + "-" + mm + "-" + dd;
    this.end_date = ty + "-" + tm + "-" + td;

    leagueService.getMatches().subscribe((data) => this.matches = data);
    leagueService.getOpenLeague().subscribe((data) => {
      this.league = data;
      this.fetchMatch(this.start_date, this.end_date);
    })
  }

  selectDate(type: string, event: any) {
    this.events = [];
    this.events.push(`${type}: ${event.value}`);
    let s_date = this.events[0].slice(11, 23);
    let e_date = new Date(s_date);
    let t_date = new Date(e_date.setDate(e_date.getDate() + 1));
    let dd = String(t_date.getDate()).padStart(2, '0');
    let mm = String(t_date.getMonth() + 1).padStart(2, '0');
    let yyyy = t_date.getFullYear();
    this.date = yyyy + "-" + mm + "-" + (Number(dd)-1);
  }

  async fetchMatch(startDate: string, endDate: string) {
    let id = 0;
    if(this.league === 'laliga') id = 1511;
    else id = 352;
    const req = await fetch(`https://app.sportdataapi.com/api/v1/soccer/matches?apikey=2f2b7820-86f4-11eb-b165-0792cfd2240a&season_id=${id}&date_from=${startDate}&date_to=${endDate}`);
    const res = await req.json();
    this.matches = res.data;
  }


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
    this.fetchMatch(s_date, end);
  }
}
