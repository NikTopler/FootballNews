import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit{

  constructor(
    private router: Router,
    private userService: UserService,
    private authenticationService: AuthenticationService) { }

  ngOnInit() { }

  @Input() userInfo: any = null;
  @Input() loggedIn: boolean = false;

  @Output() loginPopup = new EventEmitter<boolean>();
  openLogin(val: boolean) { this.loginPopup.emit(val); }

  openPage(page: string) { this.router.navigateByUrl(page); }

  logout() { this.authenticationService.logout(); }

}

