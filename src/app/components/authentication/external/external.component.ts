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
    this.socialAuthService.authState.subscribe((user) => {
      this.userInfo = user;
      this.loggedIn = (user != null);
      if(this.loggedIn) this.socialLogin(this.userInfo);
    });
  }

  google(): void { this.authentication.loginWithGoogle(); }
  facebook(): void { this.authentication.loginWithFacebook(); }
  logout(): void { this.authentication.logOut(); }

  async socialLogin(
    {id, firstName, lastName, email ,photoUrl, provider} :
    {id: string, firstName: string, lastName: string, email: string,photoUrl: string, provider: string}
  ) {
    const userInfo = JSON.stringify(Object.values({id, firstName, lastName, email, photoUrl}));
    const req = await fetch(`${environment.db}/insert.php`, {
      method: 'POST',
      body: this.comm.createFormData(provider, userInfo)
    });
    const res = await req.text();
    console.log(res);
  }

}
