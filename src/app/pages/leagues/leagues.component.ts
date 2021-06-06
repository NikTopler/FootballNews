import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LeagueService } from 'src/app/services/league/league.service';

@Component({
  selector: 'app-leagues',
  templateUrl: './leagues.component.html',
  styleUrls: ['./leagues.component.scss']
})
export class LeaguesComponent implements OnInit {

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private leagueService: LeagueService) {
    route.params.subscribe(params => leagueService.setOpenLeague(params.league));
  }

  ngOnInit(): void { }

}
