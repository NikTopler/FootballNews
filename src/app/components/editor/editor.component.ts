import { Component, OnInit } from '@angular/core';
import { EditorService } from 'src/app/services/editor/editor.service';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent {

  isIntervalRunning: boolean = false;
  intervalArray: any[] = [];
  contentArray: any[] = this.editorService.activeArray;
  previous: string = '';
  loading: boolean = true;

  constructor(private editorService: EditorService) {
    this.editorService.getLoading()
      .subscribe((data) => this.loading = data)
  }

  get getBlinkingCursorElement() { return document.querySelector('.blinking-cursor') as HTMLDivElement }
  get getContentContainer() { return document.getElementById('content-container') as HTMLDivElement }
  get getRowContentContainer() { return document.getElementById('row-container') as HTMLDivElement }
  get getAllPreElements() { return document.querySelectorAll('pre'); }

  selectClass(data: string): string[] {
    let array = [];
    if(data === 'BREAK') array = ['white-space', ''];
    else if(Number(data) || data === '0') array = ['number', data];
    else if(data === null || data === 'null') array = ['null', 'null'];
    else if(this.previous === ':') array = ['red', data];
    else if(data[0] === '"' && data[data.length-1] === '"') array = ['dark-red', data];
    else array = ['', data];
    this.previous = data;
    return array;
  }
}
