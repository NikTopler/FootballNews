import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { CommService } from 'src/app/services/comm/comm.service';
import { UserService } from 'src/app/services/user/user.service';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.scss']
})
export class EmailComponent implements OnInit {

  emailForm: FormGroup;

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

  constructor(
    private fb: FormBuilder,
    private authenticationService: AuthenticationService,
    private comm: CommService,
    private userService: UserService) {
    this.emailForm = this.fb.group({
      subject: ['', [Validators.required]],
      message: ['', [Validators.required]]
    });
  }

  ngOnInit(): void { this.setupEvents(); }

  get getEmailTagContainer() { return document.querySelector('.tag-input.emails') as HTMLDivElement; }
  get getHeaderTagContainer() { return document.querySelector('.tag-input.headers') as HTMLDivElement; }
  get getEmailInput() { return document.getElementById('add-email') as HTMLInputElement; }

  setupEvents() {
    const addEmailInput = document.getElementById('add-email') as HTMLInputElement;
    addEmailInput.onkeyup = (e) => {
      const userInput = addEmailInput.value.trim().toLowerCase();
      if(e.key !== 'Enter') return;
      this.manageNewEmail(this.getEmailInput);
    }
  }

  manageNewEmail(input: HTMLInputElement) {
    const value = input.value;
    if(!this.authenticationService.validateEmail(value)) return;
    if(this.allAddedEmails.filter((object) => object.text === value).length !== 0) return;
    if(!this.getEmailTagContainer.classList.contains('active')) this.getEmailTagContainer.classList.add('active');

    this.allAddedEmails.push({text: value, class: this.randomColor()});
    input.value = '';
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

  removeEmail(email: string) {
    this.allAddedEmails = this.allAddedEmails.filter(f => f.text !== email);
    this.checkForEmptyArray(this.allAddedEmails, this.getEmailTagContainer);
  }
  removeHeader(header: string) {
    this.allHeaders = this.allHeaders.filter(f => f.text !== header);
    this.checkForEmptyArray(this.allHeaders, this.getHeaderTagContainer);
  }

  checkForEmptyArray(array: headerEmail[], container: HTMLDivElement) {
    if(array.length === 0) container.classList.remove('active');
    else container.classList.add('active');
  }

  randomColor() {
    const randomNumber = Math.floor(Math.random() * this.colorScheme.length);
    return this.colorScheme[randomNumber];
  }
}

export interface headerEmail {
  text: string,
  class: string
}
