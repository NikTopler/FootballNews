import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';

@Component({
  selector: 'app-external',
  templateUrl: './external.component.html',
  styleUrls: ['./external.component.scss']
})
export class ExternalComponent implements OnInit {

  constructor(private authentication: AuthenticationService) { }

  ngOnInit(): void {
  }


  google() {
    this.authentication.loginWithGoogle();
  }
  facebook() {
    this.authentication.loginWithFacebook();
  }
  logout() {
    this.authentication.logOut();
  }

}
