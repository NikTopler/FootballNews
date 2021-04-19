import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { CommService } from '../comm/comm.service';
import * as CryptoJS from "crypto-js";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  userInfo: userData | null = null;

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
}

export interface userData {
  id: string,
  firstName: string,
  lastName: string,
  email: string,
  admin: string,
  createdAt: string,
  updatedAt: string,
  profileImg: string,
  googleID: string,
  facebookID: string,
  amazonID: string,
  safeImport: string,
  editImport: string
}
