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

  team: any = null;
  stat: any = null;

  constructor(
    private leagueService: LeagueService,
    private comm: CommService) {
    leagueService.getStandings().subscribe(data => {
      this.standingsArray = data;
      if(data.length === 20) {
        this.team = document.querySelectorAll(`.team`);
        this.stat = document.querySelectorAll(`.stats`);
        this.setupElementEvents();
      }
    });
    this.setSelectedSeason();
  }

  setupElementEvents() {

    for(let i = 0; i < this.team.lenght; i++) {
      this.team[i].addEventListener('mouseover', () => {
        this.team[i].classList.add('hover');
        this.stat[i].classList.add('hover');
      });
      this.team[i].addEventListener('mouseout', () => {
        this.team[i].classList.remove('hover');
        this.stat[i].classList.remove('hover');
      });
      this.stat[i].addEventListener('mouseover', () => {
        this.team[i].classList.add('hover');
        this.stat[i].classList.add('hover');
      });
      this.stat[i].addEventListener('mouseout', () => {
        this.team[i].classList.remove('hover');
        this.stat[i].classList.remove('hover');
      });
    }
  }

  setSelectedSeason() { this.selectedSeason = this.seasons.filter(function(season) { return season.active})[0].text }
  changeOption(text: string, id: string) {
    this.comm.changeOption(text, id, this.seasons, this.selectOpen);
    this.setSelectedSeason();
  }
  manageSelect(id: string) { this.comm.manageSelect(id, this.selectOpen) }
  getPercentage(all: number, part: number) { return Math.floor((part/all)*100); }
}
