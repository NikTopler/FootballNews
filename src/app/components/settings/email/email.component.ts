import { Component } from '@angular/core';
import { AppComponent } from 'src/app/app.component';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { CommService } from 'src/app/services/comm/comm.service';
import { UserService } from 'src/app/services/user/user.service';
import { environment } from '../../../../environments/environment';
import { SettingsComponent } from '../settings.component';

@Component({
  selector: 'app-email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.scss']
})
export class EmailComponent {

  userInfo: any = this.app.userInfo;
  subscribed: boolean = Number(this.app.userInfo.emailingService) === 0 ? false : true;

  allLeagues: string[] = [];
  followingLeagues: string[] = [];

  constructor(
    private app: AppComponent,
    private userService: UserService,
    private comm: CommService,
    private authenticationService: AuthenticationService,
    private SettingsComponent: SettingsComponent,
    private AppComponent: AppComponent) {
      this.getAllLeagues();
      this.getFollowList();
    }

  async emailingService() {

    this.AppComponent.waitForResponse = true;

    const isUserValidated = await this.validateUser();
    if(!isUserValidated) return location.reload();

    const userInfo = JSON.stringify({"email": this.userInfo.email, "subscription": this.subscribed ? 1 : 0});
    const req = await fetch(`${environment.db}/update.php`, {
      method: 'POST',
      body: this.comm.createFormData('EMAIL_SUBSCRIPTION', userInfo)
    });
    const res = await req.text();

    this.SettingsComponent.createMessage(true, this.subscribed ? 'You have subscribed to our email service' : 'You have unsubscribed to our email service', 'success');
    this.AppComponent.waitForResponse = false;

  }

  }

}
