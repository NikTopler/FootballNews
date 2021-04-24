import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LaligaStandingsComponent } from './laliga-standings.component';

describe('LaligaStandingsComponent', () => {
  let component: LaligaStandingsComponent;
  let fixture: ComponentFixture<LaligaStandingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LaligaStandingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LaligaStandingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
