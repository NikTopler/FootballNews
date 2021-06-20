import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { CommService } from 'src/app/services/comm/comm.service';

@Component({
  selector: 'app-external',
  templateUrl: './external.component.html',
  styleUrls: ['./external.component.scss']
})
export class ExternalComponent implements OnInit {

  open: boolean = false;
  slp: boolean = false;

  constructor(
    private authentication: AuthenticationService,
    private comm: CommService) {
      comm.getExternalLogin().subscribe((data) => { this.open = data; })
      comm.getSlp().subscribe((data) => { this.slp = data; })
    }

  ngOnInit() { this.setupEvents(); }

  setupEvents() {
    const clickDismissArray = document.querySelectorAll('.eld');

    window.addEventListener('click', () => {
      if(this.open && this.slp) this.comm.setExternalLogin(false);
      else this.comm.setSlp(true);
    });

    for(let i = 0; i < clickDismissArray.length; i++)
      clickDismissArray[i].addEventListener('click', (e) => e.stopPropagation());
  }

  google(): void { this.authentication.loginWithGoogle(); }
  facebook(): void { this.authentication.loginWithFacebook(); }
  amazon(): void { this.authentication.loginWithAmazon(); }

  openLogin(val: boolean) { this.comm.setExternalLogin(val); }
}
