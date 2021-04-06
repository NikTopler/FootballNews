import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { CommService } from '../comm/comm.service';
import * as CryptoJS from "crypto-js";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  userInfo: object = {};

  constructor(private comm: CommService) { }

  async regenerateAccessToken(refreshToken: string, key: string) {
    const req = await fetch(`${environment.db}/user.php`, {
      method: 'POST',
      body: this.comm.createFormData('REGENERATE_ACCESS_TOKEN', refreshToken)
    });
    const res = await req.text();
    const encrypted = CryptoJS.AES.encrypt(res, key);
    window.localStorage.setItem('accessToken', encrypted.toString());
    return true;
  }

  async checkRefreshToken(token: string) {
    const req = await fetch(`${environment.db}/user.php`, {
      method: 'POST',
      body: this.comm.createFormData('VALIDATE_REFRESH_TOKEN', token)
    });
    const res = await req.text();
    return JSON.parse(res).status === 'Good' ? JSON.parse(res) : null;
  }

  async checkAccessToken(token: string) {
    const req = await fetch(`${environment.db}/user.php`, {
      method: 'POST',
      body: this.comm.createFormData('VALIDATE_ACCESS_TOKEN', token)
    });
    const res = await req.text();
    return JSON.parse(res).status === 'Good' ? JSON.parse(res) : null;
  }
}
