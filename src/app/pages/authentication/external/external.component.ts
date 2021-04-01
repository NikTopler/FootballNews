import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { AppComponent } from '../../../app.component';

@Component({
  selector: 'app-external',
  templateUrl: './external.component.html',
  styleUrls: ['./external.component.scss']
})
export class ExternalComponent implements OnInit {

  constructor(
    private authentication: AuthenticationService,
    private app: AppComponent) { }

  ngOnInit() {
    const extraSocialLogin = document.querySelector('.external-social-login') as HTMLDivElement;
    const loginBtn = document.querySelector('.login-btn') as HTMLDivElement;
    window.addEventListener('click', () => {
      if(this.app.socialLoginPopup && this.app.slp !== 0) this.loginPopup.emit(false)
      else this.app.slp = 1;
    });
    extraSocialLogin.addEventListener('click', (e) => e.stopPropagation());
    loginBtn.addEventListener('click', (e) => e.stopPropagation());
  }

  @Output() loginPopup = new EventEmitter<boolean>();
  @Output() social = new EventEmitter();

  google(): void { this.authentication.loginWithGoogle(); }
  facebook(): void { this.authentication.loginWithFacebook(); }
  amazon(): void { this.authentication.loginWithAmazon(); }

  openLogin(val: boolean) { this.loginPopup.emit(val); }
}
