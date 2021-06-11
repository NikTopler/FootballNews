import { Component, OnInit } from '@angular/core';
import { LeagueService, StandingsInterface } from 'src/app/services/league/league.service';

@Component({
  selector: 'app-standings',
  templateUrl: './standings.component.html',
  styleUrls: ['./standings.component.scss']
})
export class StandingsComponent implements OnInit {

  constructor() { }
  standingsArray: StandingsInterface[] = [];

  ngOnInit(): void {
    private leagueService: LeagueService,
    leagueService.getStandings().subscribe(data => this.standingsArray = data);
  }

}
