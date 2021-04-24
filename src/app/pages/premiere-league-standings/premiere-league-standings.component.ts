import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-premiere-league-standings',
  templateUrl: './premiere-league-standings.component.html',
  styleUrls: ['./premiere-league-standings.component.scss']
})
export class PremiereLeagueStandingsComponent implements OnInit {
  top: any;
  st:any;
  team:any;

  constructor(private http: HttpClient) { }

  ngOnInit(){




    let a = this.http.get("https://app.sportdataapi.com/api/v1/soccer/topscorers?apikey=2f2b7820-86f4-11eb-b165-0792cfd2240a&season_id=352");
    a.subscribe((data) => {
      this.top = data;
      this.top = this.top.data.slice(0,30);
    })




    let standings = this.http.get("https://app.sportdataapi.com/api/v1/soccer/standings?apikey=2f2b7820-86f4-11eb-b165-0792cfd2240a&season_id=352");
    standings.subscribe((data) => {
      this.st = data;
      this.st = this.st.data.standings;
    })


      let teams = this.http.get("https://app.sportdataapi.com/api/v1/soccer/teams?apikey=2f2b7820-86f4-11eb-b165-0792cfd2240a&country_id=42");
      teams.subscribe((data) => {
        this.team = data;
        this.team = this.team.data;
      })

  }

}
