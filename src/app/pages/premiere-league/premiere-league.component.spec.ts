import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PremiereLeagueComponent } from './premiere-league.component';

describe('PremiereLeagueComponent', () => {
  let component: PremiereLeagueComponent;
  let fixture: ComponentFixture<PremiereLeagueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PremiereLeagueComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PremiereLeagueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
