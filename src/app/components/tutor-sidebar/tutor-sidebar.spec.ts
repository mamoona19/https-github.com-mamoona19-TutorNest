import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TutorSidebar } from './tutor-sidebar';

describe('TutorSidebar', () => {
  let component: TutorSidebar;
  let fixture: ComponentFixture<TutorSidebar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TutorSidebar],
    }).compileComponents();

    fixture = TestBed.createComponent(TutorSidebar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
