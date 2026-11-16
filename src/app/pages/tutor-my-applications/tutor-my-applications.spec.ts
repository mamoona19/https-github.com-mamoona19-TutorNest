import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TutorMyApplications } from './tutor-my-applications';

describe('TutorMyApplications', () => {
  let component: TutorMyApplications;
  let fixture: ComponentFixture<TutorMyApplications>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TutorMyApplications],
    }).compileComponents();

    fixture = TestBed.createComponent(TutorMyApplications);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
