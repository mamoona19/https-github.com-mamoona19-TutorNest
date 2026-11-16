import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PendingPayments } from './pending-payments';

describe('PendingPayments', () => {
  let component: PendingPayments;
  let fixture: ComponentFixture<PendingPayments>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PendingPayments],
    }).compileComponents();

    fixture = TestBed.createComponent(PendingPayments);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
