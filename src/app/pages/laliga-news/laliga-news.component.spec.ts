import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LaligaNewsComponent } from './laliga-news.component';

describe('LaligaNewsComponent', () => {
  let component: LaligaNewsComponent;
  let fixture: ComponentFixture<LaligaNewsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LaligaNewsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LaligaNewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
