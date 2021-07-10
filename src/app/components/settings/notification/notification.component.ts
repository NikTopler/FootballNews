import { Component } from '@angular/core';
import { AppComponent } from 'src/app/app.component';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { CommService } from 'src/app/services/comm/comm.service';
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

  allLeagues: string[] = [];
  followingLeagues: any = [];

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
        this.followingLeagues = userInfo.following;
      })
    }

  async emailingService() {

    this.comm.setWaitForResponse(true);

    const isUserValidated = await this.validateUser();
    if(!isUserValidated) return location.reload();

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

  async validateUser() {
    const userValidation = await this.userService.validateUser();

    if(userValidation.status === 401 && userValidation.body.includes('Refresh'))
      return location.reload();
    else if(userValidation.status === 401 && userValidation.body.includes('Access'))
      return this.authenticationService.logout();
    else if(userValidation.status === 404)
      return false;
    return true;
  }

  async getAllLeagues() {
    const req = await fetch(`${environment.db}/update.php`, {
      method: 'POST',
      body: this.comm.createFormData('GET_LEAGUES', '')
    });
    const res = await req.text();
    const leagues: string[][] = JSON.parse(res).data;

    for(let i = 0; i < leagues.length; i++)
      this.allLeagues.push(leagues[i][0]);
  }

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
    const isUserValidated = await this.validateUser();
    if(!isUserValidated) return location.reload();

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
