import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TutorMyProfile } from './tutor-my-profile';

describe('TutorMyProfile', () => {
  let component: TutorMyProfile;
  let fixture: ComponentFixture<TutorMyProfile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TutorMyProfile],
    }).compileComponents();

    fixture = TestBed.createComponent(TutorMyProfile);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
