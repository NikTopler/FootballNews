import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommService } from 'src/app/services/comm/comm.service';
import { environment } from '../../../../environments/environment';

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
  ){
    this.signinForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      psw: ['', [Validators.required]]
    });
  }

  async onSubmit() {
    if(!this.signinForm.valid) return;

    const userInfo = JSON.stringify(Object.values(this.signinForm.value));
    const req = await fetch(`${environment.db}/check.php`, {
      method: 'POST',
      body: this.comm.createFormData('signin', userInfo)
    })
    const res = await req.text();
    console.log(res);
  }
}
