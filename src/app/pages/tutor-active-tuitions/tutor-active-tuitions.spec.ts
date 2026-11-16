import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TutorActiveTuitions } from './tutor-active-tuitions';

describe('TutorActiveTuitions', () => {
  let component: TutorActiveTuitions;
  let fixture: ComponentFixture<TutorActiveTuitions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TutorActiveTuitions],
    }).compileComponents();

    fixture = TestBed.createComponent(TutorActiveTuitions);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
