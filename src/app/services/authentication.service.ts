import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  name(word: string) {
    return (formGroup: FormGroup) => {
      const nameControl = formGroup.controls[word];
      const regex = new RegExp("^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$");
      return regex.test(nameControl.value) ? nameControl.setErrors(null) : nameControl.setErrors({ valid: false });
    }
  }

  matchPasswords(psw: string, pswConfirm: string) {
    return (formGroup: FormGroup) => {
      const pswControl = formGroup.controls[psw];
      const confirmPswControl = formGroup.controls[pswConfirm];

      if(!pswControl || !confirmPswControl) return null;
      if(confirmPswControl.errors && !confirmPswControl.errors.passwordMismatch) return null;
      if(pswControl.value !== confirmPswControl.value) confirmPswControl.setErrors({ passwordMismatch: true });
      else confirmPswControl.setErrors(null);
      return !null;
    }
  }
}
