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

  isLoaded: boolean = false;
  showFooter: boolean = false;

  constructor(
    private router: Router,
    private socialAuthService: SocialAuthService,
    private comm: CommService,
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private downloadService: DownloadService) {
    this.socialAuthService.authState.subscribe((user) => {
      this.userInfo = user.provider !== 'AMAZON' ? user : {
        "id": user.id,
        "firstName": user.name.split(' ')[0],
        "lastName": user.name.split(' ')[1],
        "email": user.email,
        "photoUrl": null,
        "provider": 'AMAZON'
      }
      this.socialLoginPopup = false;
      this.loggedIn = (user != null && user.email != null);
      if(this.loggedIn) this.socialLogin(this.userInfo);
    });
    Promise.resolve(this.checkAuthentication())
    comm.getExternalLogin().subscribe((data) => { this.socialLoginPopup = data; })
    this.userService.getUserData().subscribe((data) => { this.userInfo = data; })
    this.downloadService.getIsOpen().subscribe((val) => { this.downloadOpen = val; });
    this.comm.getIsLoaded().subscribe((data) => { this.isLoaded = data; })
    router.events.subscribe(() => { this.showFooter = !router.url.includes('settings') })
  }

  async checkAuthentication() {
    this.reload = true;
    this.waitForResponse = true;

    const res = await this.userService.validateUser();

    if(res.status === 401 && res.body.includes('Refresh')) {
      this.reload = false;
      this.waitForResponse = false;
      return;
    }
    else if(res.status === 401 && res.body.includes('Access')) return this.authenticationService.logout();
    else if(res.status === 404) this.checkAuthentication();

    if(res.body.data) {
      if(res.body.data.data.email) {
        this.userService.setUserData(res.body.data.data);
        this.loggedIn = true;
        this.waitForResponse = false;
        this.reload = false;
      } else this.authenticationService.logout();
    }
  }

  async socialLogin(
    {id, firstName, lastName, email ,photoUrl, provider} :
    {id: string, firstName: string, lastName: string, email: string, photoUrl: string, provider: string}
  ) {
    this.waitForResponse = true;
    const userInfo = JSON.stringify(Object.values({id, firstName, lastName, email, photoUrl, provider}));
    const req = await fetch(`${environment.db}/insert.php`, {
      method: 'POST',
      body: this.comm.createFormData('SOCIAL', userInfo)
    });
    const res = await req.text();

    const encrypted = this.userService.encryptToken(JSON.parse(res).jwt, JSON.parse(res).id);

    window.localStorage.setItem('accessToken', encrypted.toString());

    this.userService.deleteCookie('refreshToken', '/');
    this.userService.setCookie('refreshToken', JSON.parse(res).refreshToken, 5, '/');

    this.waitForResponse = false;
    this.loggedIn = true;

    this.userService.setUserData(JSON.parse(res).data);
  }
}
