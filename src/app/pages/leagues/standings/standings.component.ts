import { Component } from '@angular/core';
import { CommService } from 'src/app/services/comm/comm.service';
import { AllSeasons, LeagueService, Season, Standing } from 'src/app/services/league/league.service';

@Component({
  selector: 'app-standings',
  templateUrl: './standings.component.html',
  styleUrls: ['./standings.component.scss']
})
export class StandingsComponent {

  standingsArray: Standing[] = [];
  selectOpen: boolean = false;
  seasons: AllSeasons[] = [];
  selectedSeason: string = '';

  team: any = null;
  stat: any = null;

  season: Season = {id: null, start: '', end: '', name: '', active: false, standings: [], teams: [], players: []};

  constructor(
    private leagueService: LeagueService,
    private comm: CommService) {
    leagueService.getActiveSeason().subscribe(data => {
      this.season = data;
      this.standingsArray = data.standings;
      if(data.standings.length === 20) {
        this.team = document.querySelectorAll(`.team`);
        this.stat = document.querySelectorAll(`.stats`);
        this.setupElementEvents();
      }
    });

    leagueService.getAllSeasons().subscribe(data => {
      this.seasons = data;
      if(data.length > 0)
        this.selectedSeason = data.filter(season => { return season.active })[0].name
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

  setSelectedSeason() { this.selectedSeason = this.seasons.filter(season => { return season.active})[0]?.name }
  changeOption(name: string, id: string) {
    this.comm.changeOption(name, id, this.seasons, this.selectOpen);
    this.setSelectedSeason();
    this.leagueService.setupActiveSeason(this.selectedSeason.substring(2));
  }
  manageSelect(id: string) { this.comm.manageSelect(id, this.selectOpen) }
  getPercentage(all: number, part: number) { return Math.floor((part/all)*100) }
  setupDate(date: string) { return this.comm.setupDate(date); }
}
