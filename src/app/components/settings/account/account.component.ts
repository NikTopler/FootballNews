import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppComponent } from 'src/app/app.component';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { CommService } from 'src/app/services/comm/comm.service';
import { UserService } from 'src/app/services/user/user.service';
import { environment } from '../../../../environments/environment';
import { SettingsComponent } from '../settings.component';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent {

  userInfo: any = this.userService.userInfo;
  updateForm: FormGroup;

  constructor(
    private userService: UserService,
    private authenticationService: AuthenticationService,
    private comm: CommService,
    private fb: FormBuilder,
    private settingsComponent: SettingsComponent,
    private appComponent: AppComponent) {
      this.updateForm = this.fb.group({
        fName: [this.userInfo.firstName, [Validators.required]],
        lName: [this.userInfo.lastName, [Validators.required]],
        email: [this.userInfo.email, [Validators.required, Validators.email]]
      },
      {
        validator: [
          this.authenticationService.name('fName'),
          this.authenticationService.name('lName'),
        ]
      });
    }

  async onSubmit() {

    if(!this.updateForm.valid)
      return this.settingsComponent.createMessage(true, 'First name and last name are not valid', 'err');

    if(this.updateForm.value.fName.trim() === this.userInfo.firstName
    && this.updateForm.value.lName.trim() === this.userInfo.lastName)
      return this.settingsComponent.createMessage(true, 'No changes made', 'err');

    const userInfo = JSON.stringify(Object.values(
      {"fName": this.updateForm.value.fName,
      "lName": this.updateForm.value.lName,
      "email": this.userInfo.email}));
    const req = await fetch(`${environment.db}/user.php`, {
      method: 'POST',
      body: this.comm.createFormData('UPDATE_ACCOUNT', userInfo)
    });
    const res = await req.text();
    this.updateUserData();
  }

  convertToDate(num: string) {
    const number = Number(num);
    const currentdate = new Date(1000 * number);
    return ((currentdate.getDate() > 9) ? currentdate.getDate() : '0' + currentdate.getDate()) + '-' +
          (((currentdate.getMonth()+1) > 9) ? (currentdate.getMonth()+1) : '0' + (currentdate.getMonth()+1)) + '-' +
          currentdate.getFullYear() + ' ' +
          ((currentdate.getHours() > 9) ? currentdate.getHours() : '0' + currentdate.getHours()) + ':' +
          ((currentdate.getMinutes() > 9) ? currentdate.getMinutes() : '0' + currentdate.getMinutes()) + ':' +
          ((currentdate.getSeconds() > 9) ? currentdate.getSeconds() : '0' + currentdate.getSeconds());
  }


  async updateUserData() {
    const refreshToken = this.userService.getRefreshToken();
    let key = await this.userService.checkRefreshToken(refreshToken);
    key = key.data.token;
    this.userService.regenerateAccessToken(refreshToken, key)
      .then(() => {
        localStorage.setItem('updateAccount', 'true');
        this.appComponent.checkAuthentication();
      });
  }

  verifySocialLogin() { this.authenticationService.logout(); }
}
