import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TutorMyDemos } from './tutor-my-demos';

describe('TutorMyDemos', () => {
  let component: TutorMyDemos;
  let fixture: ComponentFixture<TutorMyDemos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TutorMyDemos],
    }).compileComponents();

    fixture = TestBed.createComponent(TutorMyDemos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
