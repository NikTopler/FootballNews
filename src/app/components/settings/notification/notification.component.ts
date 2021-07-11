import { Component } from '@angular/core';
import { AppComponent } from 'src/app/app.component';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { CommService, Following, Leagues } from 'src/app/services/comm/comm.service';
import { UserService } from 'src/app/services/user/user.service';
import { environment } from '../../../../environments/environment';
import { SettingsComponent } from '../settings.component';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent {

  userInfo: any;
  subscribed: boolean = Number(this.app.userInfo.emailingService) === 0 ? false : true;

  allLeagues: Leagues[] = [];
  followingLeagues: Following[] = [];

  constructor(
    private app: AppComponent,
    private userService: UserService,
    private comm: CommService,
    private authenticationService: AuthenticationService,
    private SettingsComponent: SettingsComponent,
    private appComponent: AppComponent) {
      this.getAllLeagues();
      this.userService.getUserData().subscribe((userInfo) => {
        this.userInfo = userInfo;
        this.followingLeagues = userInfo.following ? userInfo.following : []
      })
    }

  async emailingService() {

    this.comm.setWaitForResponse(true);
    await this.userService.validate();

    const userInfo = JSON.stringify({"email": this.userInfo.email, "subscription": this.subscribed ? 1 : 0});

    await fetch(`${environment.db}/update.php`, {
      method: 'POST',
      body: this.comm.createFormData('EMAIL_SUBSCRIPTION', userInfo)
    });

    this.userService.updateUserData('notifications')
      .then(res => { if(!res) this.authenticationService.logout() })
    this.SettingsComponent.createMessage(true, this.subscribed ? 'You are subscribed' : 'You are unsubscribed', 'notification');
    this.comm.setWaitForResponse(false);
  }

  async getAllLeagues() { this.allLeagues = await this.comm.getAllLeagues(); }

  compareLeagues(league: string, array: any[]) {
    for(let i = 0; i < array.length; i++)
      if(league.toLowerCase() === array[i].name.toLowerCase())
        return true;
    return false;
  }

  async manageFollowLeagues(e: any, league: string) {
    this.comm.setWaitForResponse(true);
    let follow: string = 'FOLLOW_LEAGUE';

    if(e.target.innerHTML.trim() === 'Unfollow') follow = 'UNFOLLOW_LEAGUE';
    await this.userService.validate();

    const data = JSON.stringify({ "email": this.userInfo.email, "leagueName": league });
    await fetch(`${environment.db}/update.php`, {
      method: 'POST',
      body: this.comm.createFormData(follow, data)
    });

    this.userService.updateUserData('follow')
      .then((res) => {
        this.comm.setWaitForResponse(false);
        if(!res) this.authenticationService.logout();
      })
  }
}
