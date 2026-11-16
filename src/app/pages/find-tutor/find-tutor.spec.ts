import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FindTutor } from './find-tutor';

describe('FindTutor', () => {
  let component: FindTutor;
  let fixture: ComponentFixture<FindTutor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FindTutor],
    }).compileComponents();

    fixture = TestBed.createComponent(FindTutor);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
