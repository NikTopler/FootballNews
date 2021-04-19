import { Component, OnInit } from '@angular/core';
import { CommService } from 'src/app/services/comm/comm.service';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-display',
  templateUrl: './display.component.html',
  styleUrls: ['./display.component.scss']
})
export class DisplayComponent {

  openTab: string = 'Users';

  usersArray: string[][] = [];
  teamsArray: string[][] = [];
  leaguesArray: string[][] = [];
  countriesArray: string[][] = [];

  constructor(private comm: CommService) { this.fetchData(); }

  }

}
