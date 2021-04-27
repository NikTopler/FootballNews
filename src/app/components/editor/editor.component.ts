import { Component, OnInit } from '@angular/core';
import { EditorService } from 'src/app/services/editor/editor.service';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit {

  isIntervalRunning: boolean = false;
  intervalArray: any[] = [];
  contentArray: any[] = this.editorService.activeArray;

  constructor(private editorService: EditorService) { }

  async ngOnInit() { }

  get getBlinkingCursorElement() { return document.querySelector('.blinking-cursor') as HTMLDivElement }
  get getContentContainer() { return document.getElementById('content-container') as HTMLDivElement }
  get getRowContentContainer() { return document.getElementById('row-container') as HTMLDivElement }
  get getAllPreElements() { return document.querySelectorAll('pre'); }
}
