import { Component } from '@angular/core';
import { CommService } from 'src/app/services/comm/comm.service';
import { LeagueService, StandingsInterface } from 'src/app/services/league/league.service';

@Component({
  selector: 'app-standings',
  templateUrl: './standings.component.html',
  styleUrls: ['./standings.component.scss']
})
export class StandingsComponent {

  standingsArray: StandingsInterface[] = [];
  selectOpen: boolean = false;
  seasons: any[] = [{text: '2021/22', active: false}, {text: '2020/21', active: true}];
  selectedSeason: string = '';

  constructor(
    private leagueService: LeagueService,
    private comm: CommService) {
    leagueService.getStandings().subscribe(data => this.standingsArray = data);
    this.setSelectedSeason();
  }

  setSelectedSeason() { this.selectedSeason = this.seasons.filter(function(season) { return season.active})[0].text }
  changeOption(text: string, id: string) {
    this.comm.changeOption(text, id, this.seasons, this.selectOpen);
    this.setSelectedSeason();
  }
  manageSelect(id: string) { this.comm.manageSelect(id, this.selectOpen) }
  getPercentage(all: number, part: number) { return Math.floor((part/all)*100); }
}
