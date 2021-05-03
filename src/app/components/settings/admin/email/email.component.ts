import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';

@Component({
  selector: 'app-email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.scss']
})
export class EmailComponent implements OnInit {

  selectOpen: boolean = false;

  resendOptions = [
    { text: 'One time', active: true },
    { text: 'Once a week', active: false },
    { text: 'Once a month', active: false }
  ];
  resendSpan = 'One time';

  weekOptions = [
    { text: 'Monday', active: true },
    { text: 'Tuesday', active: false },
    { text: 'Wednesday', active: false },
    { text: 'Thursday', active: false },
    { text: 'Friday', active: false },
    { text: 'Saturday', active: false },
    { text: 'Sunday', active: false },
  ];
  weekSpan = 'Monday';

  monthOptions = [
    { text: '1st', active: true },
    { text: '2nd', active: false },
    { text: '3rd', active: false },
    { text: '4th', active: false },
    { text: '5th', active: false },
    { text: '6th', active: false },
    { text: '7th', active: false },
    { text: '8th', active: false },
    { text: '9th', active: false },
    { text: '10th', active: false },
    { text: '11th', active: false },
    { text: '12th', active: false },
    { text: '13th', active: false },
    { text: '14th', active: false },
    { text: '15th', active: false },
    { text: '16th', active: false },
    { text: '17th', active: false },
    { text: '18th', active: false },
    { text: '19th', active: false },
    { text: '20th', active: false },
    { text: '21st', active: false },
    { text: '22nd', active: false },
    { text: '23rd', active: false },
    { text: '24th', active: false },
    { text: '25th', active: false },
    { text: '26th', active: false },
    { text: '27th', active: false },
    { text: '28th', active: false },
    { text: '29th', active: false },
    { text: '30th', active: false },
    { text: '31st', active: false },
  ];
  monthSpan = '1st';

  allAddedEmails: headerEmail[] = [];
  allHeaders: headerEmail[] = [
    { text: 'From: footballnews.com', class: 'blueTag' },
    { text: 'MIME-Version: 1.0', class: 'blueTag' },
    { text: 'Content-type:text/html;charset=UTF-8', class: 'blueTag' },
    { text: 'Content-type: text/css;', class: 'blueTag' },
  ];

  colorScheme: string[] = ['redTag', 'blueTag', 'purpleTag', 'greenTag', 'orangeTag', 'pinkTag'];

  constructor(private authenticationService: AuthenticationService) { }

  ngOnInit(): void { this.setupEvents(); }

  }

  getSelectContainer(id: string) { return document.getElementById(id) as HTMLDivElement; }

  manageSelect(id: string) {
    const expandContainer = this.getSelectContainer(id).querySelector('.select-expand') as HTMLDivElement;

    if(this.selectOpen) expandContainer.classList.add('active');
    else expandContainer.classList.remove('active');
  }

  changeOption(text: string, id: string) {
    let array: any = [];
    if(id.includes('resend')) {
      this.resendSpan = text;
      array = this.resendOptions;
    } else if(id.includes('week')) {
      array = this.weekOptions;
      this.weekSpan = text;
    } else if(id.includes('month')) {
      array = this.monthOptions;
      this.monthSpan = text;
    }

    for(let i = 0; i < array.length; i++)
      if(array[i].text === text) array[i].active = true;
      else array[i].active = false;
    this.selectOpen = false;
    this.manageSelect(id);
  }
}
