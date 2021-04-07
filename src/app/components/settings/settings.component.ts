import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  userInfo: any = this.userService.userInfo;
  alert: boolean = false;
  alertText: string = '';
  alertType: string = '';

  accountSettingsSection: Array<any> = [];
  preferencesSection: Array<any> = [];
  adminSection: Array<any> = [];

  constructor(
    private router: Router,
    private userService: UserService) { }

  ngOnInit(): void {
    this.accountSettingsSection = this.updateSidebarAccount;
    this.preferencesSection = this.updateSidebarPreferences;
    this.adminSection = this.updateSidebarAdmin;

    if(localStorage.getItem('updateAccount') === 'true') {
      this.alertType = 'success';
      this.alertText = 'Account successfully updated';
      this.alert = true;
      localStorage.removeItem('updateAccount');
    }
  }

  get updateSidebarAccount() {
    return [
      { name: 'Account', path: 'account', active: this.router.url.includes('account') ? 'active' : ''  },
      { name: 'Notifications', path: 'notification', active: this.router.url.includes('notification') ? 'active' : ''}
    ]
  }

  get updateSidebarPreferences() {
    return [
      { name: 'Theme', path: 'theme', active: this.router.url.includes('theme') ? 'active' : ''  },
    ];
  }

  get updateSidebarAdmin() {
    return [
      { name: 'Import', path: 'admin/import', active: this.router.url.includes('admin/import') ? 'active' : ''  },
    ];
  }

  openPage(page: string) {
    this.router.navigateByUrl(page)
      .then(() => {
        this.accountSettingsSection = this.updateSidebarAccount;
        this.preferencesSection = this.updateSidebarPreferences;
        this.adminSection = this.updateSidebarAdmin;
      });
  }
}
