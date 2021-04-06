import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, Routes } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { CommService } from 'src/app/services/comm/comm.service';
import { UserService } from 'src/app/services/user/user.service';
import { environment } from '../../../../environments/environment';

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
    private fb: FormBuilder) {
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
    if(!this.updateForm.valid) return;
    const userInfo = JSON.stringify(Object.values(
      {"fName": this.updateForm.value.fName,
      "lName": this.updateForm.value.lName,
      "email": this.userInfo.email}));
    const req = await fetch(`${environment.db}/user.php`, {
      method: 'POST',
      body: this.comm.createFormData('UPDATE_ACCOUNT', userInfo)
    });
    const res = await req.text();
    console.log(res);

    const refreshToken = this.authenticationService.getRefreshToken();
    let key = await this.userService.checkRefreshToken(refreshToken);
    key = key.data.token;
    this.userService.regenerateAccessToken(refreshToken, key)
      .then(() => location.reload());
  }

  convertToDate(num: string) {
    const number = Number(num);
    const currentdate = new Date(1000 *number);

    return currentdate.getFullYear() + '-' +
          (((currentdate.getMonth()+1) > 9) ? (currentdate.getMonth()+1) : '0' + (currentdate.getMonth()+1)) + '-' +
          (currentdate.getDate() > 9 ? currentdate.getDate() : '0' + currentdate.getDate()) + ' ' +
          currentdate.getHours() + ':' +
          currentdate.getMinutes() + ':' +
          currentdate.getSeconds();
  }


  verifySocialLogin() { this.authenticationService.logout(); }
}
