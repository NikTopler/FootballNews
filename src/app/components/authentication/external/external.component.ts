import { Component, OnInit } from '@angular/core';
import { SocialAuthService } from 'angularx-social-login';
import { environment } from '../../../../environments/environment';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { CommService } from 'src/app/services/comm/comm.service';

@Component({
  selector: 'app-external',
  templateUrl: './external.component.html',
  styleUrls: ['./external.component.scss']
})
export class ExternalComponent implements OnInit {

  userInfo: any;
  loggedIn: boolean = false;

  constructor(
    private authentication: AuthenticationService,
    private socialAuthService: SocialAuthService,
    private comm: CommService) { }

  ngOnInit(): void {
  }


  google() {
    this.authentication.loginWithGoogle();
  }
  facebook() {
    this.authentication.loginWithFacebook();
  }
  logout() {
    this.authentication.logOut();
  }

}
