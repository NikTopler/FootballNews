import { Component, OnInit } from '@angular/core';
import { SocialAuthService } from 'angularx-social-login';
import { environment } from '../environments/environment';
import { CommService } from 'src/app/services/comm/comm.service';

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
    private comm: CommService) {
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

    this.waitForResponse = false;

    if(res.includes('err')) return; // error handling

    this.userInfo = JSON.parse(res);
    this.isUserSignedIn = true;

    console.log(this.userInfo)
  }
}
