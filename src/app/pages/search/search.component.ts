import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommService } from 'src/app/services/comm/comm.service';
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
  following: any = [];

  constructor(
    private router: Router,
    private comm: CommService,
    private userService: UserService,
    private searchService: SearchService
    ) {
      searchService.getsearchArticleArray()
        .subscribe((data) => { this.searchArticleArray = data; })
      userService.getUserData()
        .subscribe((userInfo) => { this.following = userInfo.following; })
      comm.setIsLoaded(true);
      this.getAllLeagues();
    }

  async getAllLeagues() { this.allLeagues = await this.comm.getAllLeagues(); }

  addActiveClass(name: string) {
    if(!this.following) return '';
    for(let i = 0; i < this.following.length; i++)
      if(this.following[i].name === name)
        return 'active';
    return '';
  }

  openLink(url: string) { window.open(url); }
  openPage(page: string) { this.router.navigateByUrl(page); }
}
