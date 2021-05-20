import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { SearchService } from 'src/app/services/search/search.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit{

  suggestionOpen: boolean = false;
  suggestionArray: string[] = [];
  isMouseOverSuggest: boolean = false;

  extraSearchOpen: boolean = false;

  isMainInputOpen: boolean = false;
  isAccountPageOpen: boolean = false;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private searchService: SearchService) {
      router.events.subscribe((e) => {
        if(router.url.includes('settings')) this.isAccountPageOpen = true;
        else this.isAccountPageOpen = false
      })
    }

  ngOnInit() { this.setElementEvents(); }

  @Input() userInfo: any = null;
  @Input() loggedIn: boolean = false;

  @Output() loginPopup = new EventEmitter<boolean>();
  openLogin(val: boolean) { this.loginPopup.emit(val); }

  openPage(page: string) { this.router.navigateByUrl(page); }

  logout() { this.authenticationService.logout(); }

  get getSearchInput() { return document.getElementById('search-input') as HTMLInputElement; }
  get getSuggestContainer() { return document.getElementById('word-suggest-container') as HTMLDivElement; }

  setElementEvents() {

    let suggestTimeout: any = null;

    this.getSuggestContainer.onmouseenter = (e) => { this.isMouseOverSuggest = true; }
    this.getSuggestContainer.onmouseleave = (e) => { this.isMouseOverSuggest = false; }

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

  search(query: string | null) { }
}

