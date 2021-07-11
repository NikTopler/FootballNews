import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommService, Following } from 'src/app/services/comm/comm.service';
import { SearchService } from 'src/app/services/search/search.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent {

  searchArticleArray: any[] = [];
  searchNumber: number = 0;

  allLeagues: any[] = [];
  following: Following[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private comm: CommService,
    private userService: UserService,
    private searchService: SearchService) {
      searchService.getsearchArticleArray()
        .subscribe((data) => this.searchArticleArray = data);
      this.userService.getUserData()
        .subscribe(userInfo => this.following = userInfo.following ? userInfo.following : [])
      comm.setIsLoaded(true);
      this.getAllLeagues();
      this.route.queryParams.subscribe(params => this.searchService.fetchNews(params['q']) );
    }

  async getAllLeagues() { this.allLeagues = await this.comm.getAllLeagues(); }

  addActiveClass(name: string) { return this.comm.addActiveClass(this.following, name); }
  openLink(url: string) { window.open(url); }
  openPage(page: string) { this.router.navigateByUrl(`leagues/${page}/standings`); }
}
