import { Component, Output, EventEmitter } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';

@Component({
  selector: 'app-external',
  templateUrl: './external.component.html',
  styleUrls: ['./external.component.scss']
})
export class ExternalComponent {

  constructor(private authentication: AuthenticationService) { }

  @Output() loginPopup = new EventEmitter<boolean>();
  @Output() social = new EventEmitter();

  google(): void { this.authentication.loginWithGoogle(); }
  facebook(): void { this.authentication.loginWithFacebook(); }
  amazon(): void { this.authentication.loginWithAmazon(); }

  closeLogin(val: boolean) { this.loginPopup.emit(val); }
}
