import { Component } from '@angular/core';
import { SocialAuthService } from 'angularx-social-login';
import { environment } from '../environments/environment';
import { CommService } from 'src/app/services/comm/comm.service';
import { AuthenticationService } from './services/authentication/authentication.service';
import { UserService } from './services/user/user.service';
import { DownloadService } from './services/download/download.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'footballApp';

  userInfo: any = null;

  loggedIn: boolean = false;
  socialLoginPopup: boolean = false;
  reload: boolean = false;
  waitForResponse: boolean = false;
  downloadOpen: boolean = false;

  isLoaded: boolean = true;
  showFooter: boolean = false;
  underCons: boolean = false;
  popUp: boolean = false;

  constructor(
    private router: Router,
    private socialAuthService: SocialAuthService,
    private comm: CommService,
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private downloadService: DownloadService) {
    this.socialAuthService.authState.subscribe((user) => {
      if(user) {
        this.userInfo = user.provider !== 'AMAZON' ? user : {
          "id": user.id,
          "firstName": user.name.split(' ')[0],
          "lastName": user.name.split(' ')[1],
          "email": user.email,
          "photoUrl": null,
          "provider": 'AMAZON'
        }
        this.socialLoginPopup = false;
        this.loggedIn = user.email != null;
      }
      if(this.loggedIn) this.socialLogin(this.userInfo);
    });
    this.userService.getPopUp().subscribe(data => this.popUp = data ? true : false);
    Promise.resolve(this.checkAuthentication());
    this.loadingFunctions();
    this.otherFunctions();
  }

  loadingFunctions() {
    this.comm.getExternalLogin().subscribe(data => this.socialLoginPopup = data);
    this.comm.getIsLoaded().subscribe(data => this.isLoaded = data);
    this.comm.getWaitForResponse().subscribe(data => this.waitForResponse = data);
  }
  otherFunctions() {
    this.downloadService.getIsOpen().subscribe(val => this.downloadOpen = val);
    this.router.events.subscribe(() => this.showFooter = !this.router.url.includes('settings'));
    this.userService.getUserData().subscribe(data => this.userInfo = data);
    const underConsRes = this.userService.getUserAgreement();
    if(!underConsRes)
      this.userService.setPopUp('UnderConstruction');
  }

  async checkAuthentication() {
    this.reload = true;
    this.comm.setWaitForResponse(true);

    const res = await this.userService.validateUser();

    if(res.status === 401 && res.body.includes('Refresh')) {
      this.reload = false;
      this.comm.setWaitForResponse(false);
      return;
    }
    else if(res.status === 401 && res.body.includes('Access')) return this.authenticationService.logout();
    else if(res.status === 404) this.checkAuthentication();

    if(res.body.data) {
      if(res.body.data.data.email) {
        this.userService.setUserData(res.body.data.data);
        this.loggedIn = true;
        this.comm.setWaitForResponse(false);
        this.reload = false;
      } else this.authenticationService.logout();
    }
  }

  async socialLogin(userData: any) {
    this.comm.setWaitForResponse(true);
    const req = await fetch(`${environment.db}/insert.php`, {
      method: 'POST',
      body: this.comm.createFormData('SOCIAL', JSON.stringify(userData))
    });
    const res = await req.text();
    const encrypted = this.userService.encryptToken(JSON.parse(res).jwt, JSON.parse(res).id);
    window.localStorage.setItem('accessToken', encrypted.toString());

    this.authenticationService.deleteCookie('refreshToken', '/');
    this.authenticationService.setCookie('refreshToken', JSON.parse(res).refreshToken, 5, '/');

    this.comm.setWaitForResponse(false);
    this.loggedIn = true;

    this.userService.setUserData(JSON.parse(res).data);
  }
}
