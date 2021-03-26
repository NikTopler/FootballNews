import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommService {

  createFormData(word: string, values: string) {
    let formData = new FormData;
        formData.append(word, values);
    return formData;
  }
}
