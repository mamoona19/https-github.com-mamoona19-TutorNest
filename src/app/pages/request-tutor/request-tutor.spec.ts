import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RequestTutor } from './request-tutor';

describe('RequestTutor', () => {
  let component: RequestTutor;
  let fixture: ComponentFixture<RequestTutor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequestTutor],
    }).compileComponents();

    fixture = TestBed.createComponent(RequestTutor);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
