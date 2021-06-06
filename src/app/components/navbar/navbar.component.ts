import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { CommService } from 'src/app/services/comm/comm.service';
import { SearchService } from 'src/app/services/search/search.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit{

  isLoggedIn: boolean = false;

  suggestionOpen: boolean = false;
  suggestionArray: string[] = [];
  isMouseOverSuggest: boolean = false;

  extraSearchOpen: boolean = false;

  isMainInputOpen: boolean = false;
  isAccountPageOpen: boolean = false;

  query: string = '';

  constructor(
    private router: Router,
    private comm: CommService,
    private route: ActivatedRoute,
    private authenticationService: AuthenticationService,
    private searchService: SearchService,
    private userService: UserService) {
      this.pageManagment('refresh');
      router.events.subscribe(() => this.pageManagment('change-page'));
      userService.getUserData().subscribe((data) => { this.isLoggedIn = data.id ? true : false; })

    }

  ngOnInit() { this.setElementEvents(); }

  openLogin(val: boolean) { this.comm.setExternalLogin(val); }

  openPage(page: string) { this.router.navigateByUrl(page); }

  logout() { this.authenticationService.logout(); }

  pageManagment(type: string) {
    this.isAccountPageOpen = this.router.url.includes('settings');

    let value = this.route.snapshot.queryParamMap.get('q');
    this.query = value ? value : '';

    if(!this.router.url.includes('home') && this.query.length !== 0 && this.getSearchInput) this.getSearchInput.value = this.query;
    else if(this.getSearchInput && type === 'refresh' && value) this.getSearchInput.value = value;
    else if(this.router.url.includes('home') && this.getSearchInput) this.getSearchInput.value = '';
  }

  get getSearchInput() { return document.getElementById('search-input') as HTMLInputElement; }
  get getSuggestContainer() { return document.getElementById('word-suggest-container') as HTMLDivElement; }

  setElementEvents() {

    let suggestTimeout: any = null;

    this.getSuggestContainer.onmouseenter = () => { this.isMouseOverSuggest = true; }
    this.getSuggestContainer.onmouseleave = () => { this.isMouseOverSuggest = false; }

    this.getSearchInput.value = this.query;
    if(this.query.length !== 0) this.search(this.query);

    this.getSearchInput.oninput = async () => {
      const value = this.getSearchInput.value;

      clearTimeout(suggestTimeout);

      suggestTimeout = setTimeout(() => {
        if(value.length === 0) {
          this.suggestionOpen = false;
          this.suggestionArray = [];
        } else {
          this.suggestionOpen = true;
          this.searchService.suggestWords(value)
            .then(() => { this.suggestionArray = this.searchService.suggestionArray; })
        }
      }, 200);
    }
    this.getSearchInput.onkeyup = (e) => {
      if(e.key === 'Enter' && this.getSearchInput.value.length !== 0)
        this.search(null);
    }
    this.getSearchInput.onfocus = () => {
      if(this.getSearchInput.value.length !== 0)
        this.suggestionOpen = true;
      this.extraSearchOpen = false;
    }
    this.getSearchInput.onblur = () => {
      if(!this.isMouseOverSuggest)
        this.suggestionOpen = false;
    }
  }

  search(query: string | null) {
    this.getSearchInput.blur();
    query = query ? query : this.getSearchInput.value.trim();

    if(query.length === 0) return this.router.navigateByUrl('home');
    else if(this.router.url === '/search') this.router.navigate([], { queryParams: { q: query }} );
    else this.router.navigate(['/search'], { queryParams: { q: query } });

    this.suggestionOpen = false;
    this.comm.setWaitForResponse(true);
    this.searchService.fetchNews(query)
      .then(() => { this.comm.setWaitForResponse(false); })

    return;
  }
}

