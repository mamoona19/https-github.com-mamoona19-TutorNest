import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminTutorVerification } from './admin-tutor-verification';

describe('AdminTutorVerification', () => {
  let component: AdminTutorVerification;
  let fixture: ComponentFixture<AdminTutorVerification>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminTutorVerification],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminTutorVerification);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
