import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss']
})
export class PopupComponent implements OnInit {

  activePopUp: string | null = null;
  activePage: number = 0;
  allPages: HTMLElement[] = [];

  constructor(private userService: UserService) {
    userService.getPopUp().subscribe(data => this.activePopUp = data);
  }

  ngOnInit(): void {
    if(this.activePopUp) {
      document.getElementById(this.activePopUp)?.classList.remove('disabled');
      this.allPages = Array.prototype.slice.call(this.getPages)
    }
  }

  get getPages() { return document.querySelectorAll('.notification:not(.disabled) .content') }

  managePages(newActivePage: number) {
    this.removeActivePage();
    this.getPages[newActivePage].classList.add('active');
    this.activePage = newActivePage;
  }

  removeActivePage() { document.querySelector('.notification:not(.disabled) .content.active')?.classList.remove('active'); }

  dotClick(e: Event) { this.managePages(Number((e.target as Element).id.slice(-1))) }

  agreeWithAdminMode() {
    this.userService.setAdminMode(true);
    this.close();
  }

  agreeWithCookies() {
    this.userService.setUserAgreement();
    this.close();
  }

  close() { this.userService.setPopUp(null) }
}
