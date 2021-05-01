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
  alertArray: any[] = [];
  alert: boolean = false;
  alertText: string = '';
  alertType: string = '';

  accountSettingsSection: Array<any> = [];
  preferencesSection: Array<any> = [];
  adminSection: Array<any> = [];
  insightSection: Array<any> = [];

  windowWidth: number = 0;

  constructor(
    private router: Router,
    private userService: UserService) {
      router.events.subscribe(() => this.updateSidebar())
    }

  ngOnInit(): void {
    this.updateSidebar();

    if(localStorage.getItem('updateAccount') === 'true') {
      this.alertType = 'success';
      this.alertText = 'Account successfully updated';
      this.alert = true;
      localStorage.removeItem('updateAccount');
    }

    this.windowWidth = window.innerWidth;
    window.onresize = () => { this.windowWidth = window.innerWidth };
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
      { name: 'Panel', path: 'admin/panel', active: this.router.url.includes('admin/panel') ? 'active' : '' },
      { name: 'Import', path: 'admin/import', active: this.router.url.includes('admin/import') ? 'active' : ''  },
      { name: 'Display & Edit', path: 'admin/display', active: this.router.url.includes('admin/display') ? 'active' : ''  },
      { name: 'Email', path: 'admin/email', active: this.router.url.includes('admin/email') ? 'active' : ''  }
    ];
  }

  get updateSidebarInsight() {
    return [
      { name: 'Imports', path: 'admin/insight/imports', active: this.router.url.includes('insight/imports') ? 'active' : '' }
    ];
  }

  updateSidebar() {
    this.accountSettingsSection = this.updateSidebarAccount;
    this.preferencesSection = this.updateSidebarPreferences;
    this.adminSection = this.updateSidebarAdmin;
    this.insightSection = this.updateSidebarInsight;
  }

  openPage(page: string) {
    this.router.navigateByUrl(page)
      .then(() => this.updateSidebar());
  }

  fullScreenMode() {
    const mainContainer = document.querySelector('.main-section-container') as HTMLDivElement;
    const contentSection = document.querySelector('.content-section') as HTMLDivElement;

    if(mainContainer.classList.contains('full-mode')) {
      mainContainer.classList.remove('full-mode');
      contentSection.classList.remove('full-mode-content');
    } else {
      mainContainer.classList.add('full-mode');
      contentSection.classList.add('full-mode-content');
    }
  }

  createMessage(alert: boolean, text: string, type: string) {
    const obj: Message = { "alert": alert, "text": text, "type": type };
    let alreadyInArray: boolean = false;

    if(this.alertArray.length > 2) this.alertArray.shift();

    for(let i = 0; i < this.alertArray.length; i++)
      if(this.alertArray[i].text === text)
        alreadyInArray = true;

    if(!alreadyInArray) this.alertArray.push(obj);
  }
}

export interface Message {
  alert: boolean,
  text: string,
  type: string
}
