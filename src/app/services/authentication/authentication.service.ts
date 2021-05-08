import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { SocialAuthService, GoogleLoginProvider, FacebookLoginProvider, AmazonLoginProvider} from 'angularx-social-login';
import { UserService } from '../user/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  UserInfo: any;

  regex = new RegExp("^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$");
  regexDate = new RegExp("^[0-3]?[0-9].[0-3]?[0-9].(?:[0-9]{2})?[0-9]{2}$");

  constructor(
    private socialAuthService: SocialAuthService,
    private router: Router,
    private userService: UserService) { }

  loginWithGoogle(): void { this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID).catch(err => console.log('Google err')); }
  loginWithFacebook(): void { this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID).catch(err => console.log('Facebook err')); }
  loginWithAmazon(): void { this.socialAuthService.signIn(AmazonLoginProvider.PROVIDER_ID).catch(err => console.log('Facebook err')); }
  logout(): void {
    window.localStorage.removeItem('accessToken');
    this.userService.deleteCookie('refreshToken', '/');
    this.router.navigateByUrl('home')
      .then(() => { location.reload() });
  }

  checkDate(word: string) { return word.match(this.regexDate); }

  firstLastName(word: string) { return this.regex.test(word) ? true : false; }

  name(word: string) {
    return (formGroup: FormGroup) => {
      const nameControl = formGroup.controls[word];
      return this.regex.test(nameControl.value) ? nameControl.setErrors(null) : nameControl.setErrors({ valid: false });
    }
  }

  validateEmail(email: string) {
    const regularExpression = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regularExpression.test(String(email).toLowerCase());
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
}
