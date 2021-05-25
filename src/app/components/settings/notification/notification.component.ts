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

    this.appComponent.waitForResponse = true;

    const isUserValidated = await this.validateUser();
    if(!isUserValidated) return location.reload();

    const userInfo = JSON.stringify({"email": this.userInfo.email, "subscription": this.subscribed ? 1 : 0});
    const req = await fetch(`${environment.db}/update.php`, {
      method: 'POST',
      body: this.comm.createFormData('EMAIL_SUBSCRIPTION', userInfo)
    });
    const res = await req.text();

    this.userService.updateUserData('notifications')
      .then((res) => { if(!res) this.authenticationService.logout(); })
    this.SettingsComponent.createMessage(true, this.subscribed ? 'You have subscribed to our email service' : 'You have unsubscribed to our email service', 'notification');
    this.appComponent.waitForResponse = false;
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
    this.appComponent.waitForResponse = true;
    let follow: string = 'FOLLOW_LEAGUE';

    if(e.target.innerHTML.trim() === 'Unfollow') follow = 'UNFOLLOW_LEAGUE';

    const isUserValidated = await this.validateUser();
    if(!isUserValidated) return location.reload();

    const email = JSON.stringify({ "email": this.userInfo.email, "leagueName": league });
    const req = await fetch(`${environment.db}/update.php`, {
      method: 'POST',
      body: this.comm.createFormData(follow, email)
    });

    this.userService.updateUserData('follow')
      .then((res) => {
        this.appComponent.waitForResponse = false;
        if(!res) this.authenticationService.logout();
      })
  }
}
