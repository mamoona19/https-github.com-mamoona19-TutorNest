import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TutorAvailableRequests } from './tutor-available-requests';

describe('TutorAvailableRequests', () => {
  let component: TutorAvailableRequests;
  let fixture: ComponentFixture<TutorAvailableRequests>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TutorAvailableRequests],
    }).compileComponents();

    fixture = TestBed.createComponent(TutorAvailableRequests);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
