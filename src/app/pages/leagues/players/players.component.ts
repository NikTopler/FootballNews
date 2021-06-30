import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LeagueService, Player } from 'src/app/services/league/league.service';

@Component({
  selector: 'app-players',
  templateUrl: './players.component.html',
  styleUrls: ['./players.component.scss']
})
export class PlayersComponent {

  players: Player[] = [];

  constructor(private router: Router, private leagueService: LeagueService) { leagueService.getPlayers().subscribe((data) => this.players = data) }
  search(name: string, club: string) { this.router.navigateByUrl(`/search?q=(${name})OR(${club})`) }
}
