import { Component } from '@angular/core';
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

  userInfo: any;

  constructor(
    private userService: UserService,
    private comm: CommService,
    private authenticationService: AuthenticationService) {
      userService.getUserData().subscribe((data) => { this.userInfo = data; })
    }

  async importingData(type: string) {

    let newPreference: number = 0;
    this.comm.setWaitForResponse(true);

    if(type === 'SAFE_IMPORT')
      if(Number(this.userInfo.safeImport) === 0)
        newPreference = 1;

    if(type === 'EDIT_IMPORT')
      if(Number(this.userInfo.editImport) === 0)
        newPreference = 1;

    const data = JSON.stringify({"email": this.userInfo.email, "preference": newPreference.toString()});
    await fetch(`${environment.db}/user.php`, {
      method: 'POST',
      body: this.comm.createFormData(type, data)
    });
    this.userService.updateUserData('admin-panel')
      .then((res) => {
        if(res) this.comm.setWaitForResponse(false);
        else this.authenticationService.logout();
      })
  }
}
