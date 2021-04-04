import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { SocialAuthService, GoogleLoginProvider, FacebookLoginProvider, AmazonLoginProvider} from 'angularx-social-login';
import * as CryptoJS from "crypto-js";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  UserInfo: any;

  constructor(private socialAuthService: SocialAuthService) { }

  loginWithGoogle(): void { this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID).catch(err => console.log('Google err')); }
  loginWithFacebook(): void { this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID).catch(err => console.log('Facebook err')); }
  loginWithAmazon(): void { this.socialAuthService.signIn(AmazonLoginProvider.PROVIDER_ID).catch(err => console.log('Facebook err')); }
  logOut(): void { this.socialAuthService.signOut().catch(err => console.log('Logout err', err)); }

  name(word: string) {
    return (formGroup: FormGroup) => {
      const nameControl = formGroup.controls[word];
      const regex = new RegExp("^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$");
      return regex.test(nameControl.value) ? nameControl.setErrors(null) : nameControl.setErrors({ valid: false });
    }
  }

  matchPasswords(psw: string, pswConfirm: string) {
    return (formGroup: FormGroup) => {
      const pswControl = formGroup.controls[psw];
      const confirmPswControl = formGroup.controls[pswConfirm];

      if(!pswControl || !confirmPswControl) return null;
      if(confirmPswControl.errors && !confirmPswControl.errors.passwordMismatch) return null;
      if(pswControl.value !== confirmPswControl.value) confirmPswControl.setErrors({ passwordMismatch: true });
      else confirmPswControl.setErrors(null);
      return !null;
    }
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
}
