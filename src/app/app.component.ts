import { Component, OnInit } from '@angular/core';
import { SocialAuthService } from 'angularx-social-login';
import { environment } from '../environments/environment';
import { CommService } from 'src/app/services/comm/comm.service';
import { AuthenticationService } from './services/authentication/authentication.service';
import { UserService } from './services/user/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'footballApp';

  userInfo: any = null;
  isUserSignedIn: boolean = false;

  loggedIn: boolean = false;
  socialLoginPopup: boolean = false;
  slp: number = 0;
  waitForResponse: boolean = false;

  constructor(
    private socialAuthService: SocialAuthService,
    private comm: CommService,
    private authentication: AuthenticationService,
    private userService: UserService) {
    this.socialAuthService.authState.subscribe((user) => {
      this.userInfo = user;
      this.socialLoginPopup = false;
    });
  }

  ngOnInit() {
    this.socialAuthService.authState.subscribe((user) => {
      this.userInfo = user.provider !== 'AMAZON' ? user : {
        "id": user.id,
        "firstName": user.name.split(' ')[0],
        "lastName": user.name.split(' ')[1],
        "email": user.email,
        "photoUrl": null,
        "provider": 'AMAZON'
      }
      this.loggedIn = (user != null);
      if(this.loggedIn) this.socialLogin(this.userInfo);
    });
    this.checkAuthentication();
  }

  async checkAuthentication() {
    const refreshToken = this.authentication.getRefreshToken();
    const key = await this.userService.checkRefreshToken(refreshToken);

    if(!key) return console.log('LOGIN'); // ne naredi nič
    const accessToken = this.authentication.getAccessToken();

    if(!accessToken) return console.log('NEKI JE NAROBE');
    const decryptToken = this.authentication.decryptToken(accessToken.toString(), key);

    // Checks if access token is valid
    if(!decryptToken) return console.log('WRONG KEY');
    const res = await this.userService.checkAccessToken(decryptToken);

    if(!res) {
      if(this.userService.regenerateAccessToken(refreshToken, key))
        this.checkAuthentication();
    } else {
      this.userService.userInfo = res.data.data;
      this.userInfo = this.userService.userInfo;
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

    const encrypted = this.authentication.encryptToken(JSON.parse(res).jwt, JSON.parse(res).id);

    window.localStorage.setItem('accessToken', encrypted.toString());

    this.authentication.deleteCookie('refreshToken', '/');
    this.authentication.setCookie('refreshToken', JSON.parse(res).refreshToken, 5, '/');

    this.waitForResponse = false;
    this.isUserSignedIn = true;

    this.userService.userInfo = JSON.parse(res).data;
  }
}
