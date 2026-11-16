import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaymentAccountSettings } from './payment-account-settings';

describe('PaymentAccountSettings', () => {
  let component: PaymentAccountSettings;
  let fixture: ComponentFixture<PaymentAccountSettings>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentAccountSettings],
    }).compileComponents();

    fixture = TestBed.createComponent(PaymentAccountSettings);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
