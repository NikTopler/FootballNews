import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommService } from 'src/app/services/comm/comm.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent {

  signinForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private comm: CommService
  ) {
    this.signinForm = this.fb.group({

    });
  }

  onSubmit() {

  }
}
