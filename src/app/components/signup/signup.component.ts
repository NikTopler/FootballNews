import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { CommService } from '../../services/comm/comm.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {

  signupForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authenticate: AuthenticationService,
    private comm: CommService
  ){
    this.signupForm = this.fb.group({
      fName: ['', [Validators.required]],
      lName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      psw: ['', [Validators.required, Validators.minLength(8)]],
      pswRepeat: ['', [Validators.required, Validators.minLength(8)]]
    },
    { validator: [
        this.authenticate.name('fName'),
        this.authenticate.name('lName'),
        this.authenticate.matchPasswords('psw', 'pswRepeat')
      ]
    });
  }


  onSubmit() {
    if(this.signupForm.valid) console.log('Success!')
  }
}
