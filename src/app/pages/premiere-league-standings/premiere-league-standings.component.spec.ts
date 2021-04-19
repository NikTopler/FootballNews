import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PremiereLeagueStandingsComponent } from './premiere-league-standings.component';

describe('PremiereLeagueStandingsComponent', () => {
  let component: PremiereLeagueStandingsComponent;
  let fixture: ComponentFixture<PremiereLeagueStandingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PremiereLeagueStandingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PremiereLeagueStandingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
