import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  signupForm: FormGroup;

  constructor(
    private fb: FormBuilder) {

    this.signupForm = this.fb.group({
      fName: [],
      lName: [],
      email: [],
      psw: [],
      pswRepeat: []
    });
  }

  ngOnInit(): void {
  }

  onSubmit() {
    console.log('Submit')
  }
}
