import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { CommService } from '../comm/comm.service';
import * as CryptoJS from "crypto-js";
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  $userData: BehaviorSubject<userData>;

  constructor(private comm: CommService) {
    this.$userData = new BehaviorSubject<userData>({
      id: null,
      firstName: null,
      lastName: null,
      email: null,
      admin: null,
      createdAt: null,
      updatedAt: null,
      profileImg: null,
      googleID: null,
      facebookID: null,
      amazonID: null,
      safeImport: null,
      editImport: null,
      emailingService: null
    });
  }

  setUserData(data: userData) { this.$userData.next(data); }
  getUserData() { return this.$userData.asObservable(); }

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

  getAccessToken() { return window.localStorage.getItem('accessToken'); }
  getRefreshToken() { return this.getCookie('refreshToken'); }

  encryptToken(token: string, key: string) { return CryptoJS.AES.encrypt(token, key); }
  decryptToken(token: string, key: string) {
    try {
      const decrypt = CryptoJS.AES.decrypt(token, key);
      return decrypt.toString(CryptoJS.enc.Utf8);
    } catch(e) {
      return null;
    }
  }

  setCookie(name: string, value: string, days = 7, path = '/') {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = name + '=' + encodeURIComponent(value) + '; expires=' + expires + '; path=' + path;
  }

  getCookie(name: string) {
    return document.cookie.split('; ').reduce((r, v) => {
      const parts = v.split('=');
      return parts[0] === name ? decodeURIComponent(parts[1]) : r
    }, '');
  }

  deleteCookie(name: string, path: string) { this.setCookie(name, '', -1, path); }


  async validateUser() {

    const refreshToken = this.getRefreshToken();
    const validateRefreshToken = await this.checkRefreshToken(refreshToken);

    if(!validateRefreshToken) return { "status": 401, "body": "Authentication failure - Refresh token" };
    const key = validateRefreshToken.data.token;

    const accessToken = this.getAccessToken();
    if(!accessToken) return { "status": 401, "body": "Authentication failure - Access Token" };

    const decryptToken = this.decryptToken(accessToken.toString(), key);
    if(!decryptToken) return { "status": 401, "body": "Authentication failure - Decrypt Token" };

    const validateAccessToken = await this.checkAccessToken(decryptToken);
    if(!validateAccessToken)
      if(this.regenerateAccessToken(refreshToken, key))
        return { "status": 404, "body": "Refresh needed!" };

    return { "status": 200, "body": validateAccessToken };
  }

  async updateUserData(type: string) {
    const refreshToken = this.getRefreshToken();
    let key = await this.checkRefreshToken(refreshToken);
    key = key.data.token;
    this.regenerateAccessToken(refreshToken, key)
      .then(async () => {
        if(type === 'account') localStorage.setItem('updateAccount', 'true');
        const newUserData = await this.validateUser();
        this.setUserData(newUserData.body.data.data);
        return true;
      })
      .catch((e) => { return false; })
    return true;
  }
}

export interface userData {
  id: string | null,
  firstName: string | null,
  lastName: string | null,
  email: string | null,
  admin: string | null,
  createdAt: string | null,
  updatedAt: string | null,
  profileImg: string | null,
  googleID: string | null,
  facebookID: string | null,
  amazonID: string | null,
  safeImport: string | null,
  editImport: string | null,
  emailingService: string | null
}
