import { Component, OnInit } from '@angular/core';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.scss']
})
export class EmailComponent implements OnInit {

  userInfo: any = this.app.userInfo;

  constructor(private app: AppComponent) { }

  ngOnInit(): void {
  }

}
