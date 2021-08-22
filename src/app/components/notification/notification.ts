import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-under-construction',
  templateUrl: './notification.html',
  styleUrls: ['./notification.scss']
})
export class UnderConstructionComponent implements OnInit {

  activePage: number = 0;
  allPages: HTMLElement[] = [];

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.allPages = Array.prototype.slice.call(this.getPages);
  }

  get getPages() { return document.querySelectorAll('.notification .content'); }

  managePages(newActivePage: number) {
    this.removeActivePage();
    this.getPages[newActivePage].classList.add('active');
    this.activePage = newActivePage;
  }

  removeActivePage() { document.querySelector('.notification .content.active')?.classList.remove('active'); }

  dotClick(e: Event) { this.managePages(Number((e.target as Element).id.slice(-1))) }

  agree() {
    this.userService.setUserAgreement();
    this.userService.setUnderCons(true);
  }
}
