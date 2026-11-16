
import { Component, OnInit,ChangeDetectorRef  } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ParentService } from '../../Services/parent.service';
import {
  PaymentAccountService,
  PaymentAccount
} from '../../Services/payment-account.service';

@Component({
  selector: 'app-parent-my-invoices',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './parent-my-invoices.html',
  styleUrl: './parent-my-invoices.css'
})
export class ParentMyInvoices implements OnInit {

  invoices: any[] = [];
  isLoadingInvoices = false;
  invoicesError = '';

  paymentAccounts: PaymentAccount[] = [];
  isLoadingPaymentAccounts = false;
  paymentAccountsError = '';

  showAllInvoices = false;

  constructor(
    private parentService: ParentService,
    private paymentAccountService: PaymentAccountService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadInvoices();
    this.loadActivePaymentAccounts();
  }

 loadInvoices(): void {
  this.isLoadingInvoices = true;
  this.invoicesError = '';
  this.cdr.detectChanges();

  this.parentService.getMyInvoices().subscribe({
    next: (response) => {
      console.log('PARENT INVOICES:', response);

      this.invoices = Array.isArray(response)
        ? response
        : response?.data || [];

      this.isLoadingInvoices = false;
      this.cdr.detectChanges();
    },
    error: (error) => {
      console.error('Error loading invoices:', error);

      this.invoices = [];
      this.isLoadingInvoices = false;
      this.invoicesError = 'Unable to load your invoices.';

      this.cdr.detectChanges();
    }
  });
}

  loadActivePaymentAccounts(): void {
  this.isLoadingPaymentAccounts = true;
  this.paymentAccountsError = '';
  this.cdr.detectChanges();

  this.paymentAccountService.getActivePaymentAccounts().subscribe({
    next: (response) => {
      console.log('ACTIVE PAYMENT ACCOUNTS:', response);

      this.paymentAccounts = Array.isArray(response)
        ? response
        : response?.data || [];

      this.isLoadingPaymentAccounts = false;
      this.cdr.detectChanges();
    },
    error: (error) => {
      console.error('Error loading payment accounts:', error);

      this.paymentAccounts = [];
      this.isLoadingPaymentAccounts = false;
      this.paymentAccountsError = 'Unable to load official payment details.';

      this.cdr.detectChanges();
    }
  });
}
}
