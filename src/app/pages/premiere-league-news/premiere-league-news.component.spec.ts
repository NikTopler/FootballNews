import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PremiereLeagueNewsComponent } from './premiere-league-news.component';

describe('PremiereLeagueNewsComponent', () => {
  let component: PremiereLeagueNewsComponent;
  let fixture: ComponentFixture<PremiereLeagueNewsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PremiereLeagueNewsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PremiereLeagueNewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
