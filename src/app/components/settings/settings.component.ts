import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  accountSettingsSection: Array<any> = [
    { name: 'Account', path: 'account', active: this.router.url.includes('account') ? 'active' : ''  },
    { name: 'Update account', path: 'update', active: this.router.url.includes('update') ? 'active' : '' },
    { name: 'Email', path: 'email', active: this.router.url.includes('email') ? 'active' : ''}
  ];

  preferencesSection: Array<any> = [
    { name: 'Theme', path: 'theme', active: this.router.url.includes('theme') ? 'active' : ''  },
  ]

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

}
