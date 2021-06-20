import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommService } from 'src/app/services/comm/comm.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {

  isUserLoggedIn: boolean = false;

  constructor(
    private router: Router,
    private userService: UserService,
    private comm: CommService) {
      userService.getUserData()
        .subscribe((data) => { this.isUserLoggedIn = data.id ? true : false; })
    }

  openPage(path: string) {
    if(this.isUserLoggedIn) this.router.navigateByUrl(path);
    else this.comm.setExternalLogin(true);
  }
}
