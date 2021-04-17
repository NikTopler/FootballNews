import { Component, OnInit } from '@angular/core';
import { AppComponent } from 'src/app/app.component';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { CommService } from 'src/app/services/comm/comm.service';
import { UserService } from 'src/app/services/user/user.service';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.scss']
})
export class AdminPanelComponent {

  userInfo: any = this.userService.userInfo;

  constructor(
    private userService: UserService,
    private comm: CommService,
    private authenticationService: AuthenticationService,
    private appComponent: AppComponent) { }


  async importingData(type: string) {

    let newPreference: number = 0;

    if(type === 'SAFE_IMPORT')
      if(Number(this.userInfo.safeImport) === 0) newPreference = 1;

    if(type === 'EDIT_IMPORT')
      if(Number(this.userInfo.editImport) === 0) newPreference = 1;

    const req = await fetch(`${environment.db}/user.php`, {
      method: 'POST',
      body: this.comm.createFormData(type, JSON.stringify([this.userInfo.email, newPreference.toString()]))
    });
    const res = await req.text();
    console.log(res)
    this.updateUserData();
  }

  async updateUserData() {
    const refreshToken = this.userService.getRefreshToken();
    let key = await this.userService.checkRefreshToken(refreshToken);
    key = key.data.token;
    this.userService.regenerateAccessToken(refreshToken, key)
      .then(() => {
        localStorage.setItem('updateAccount', 'true');
        this.appComponent.checkAuthentication();
      })
  }
}
