
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { PaymentAccountService} from '../../Services/payment-account.service';

interface PendingPayment {
  paymentId: number;
  invoiceId: number | null;
  tuitionContractId: number;
  tuitionRequestId: number;
  parentId: number;
  tutorId: number;
  invoiceNumber: string;
  invoiceDate: string | null;
  dueDate: string | null;
  amount: number;
  currencyCode: string;
  transactionReference: string | null;
  paymentDate: string | null;
  createdDate: string;
  paymentMethodName: string;
  paymentGatewayName: string;
  paymentStatusName: string;
  invoiceStatusName: string | null;
}

@Component({
  selector: 'app-pending-payments',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pending-payments.html',
  styleUrl: './pending-payments.css'
})
export class PendingPaymentsComponent implements OnInit {

  payments: PendingPayment[] = [];
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  verifyingPaymentId: number | null = null;

  constructor(
    private paymentService: PaymentAccountService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadPendingPayments();
  }

  loadPendingPayments(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.paymentService.getPendingPayments().subscribe({
      next: (response) => {
        this.payments = response?.data ?? [];
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Pending payments error:', error);
        this.errorMessage =
          error?.error?.message ??
          'Unable to load pending payments.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  verifyPayment(payment: PendingPayment): void {
    const confirmed = window.confirm(
      `Verify payment ${payment.invoiceNumber} for ` +
      `${payment.currencyCode} ${payment.amount}?`
    );

    if (!confirmed) {
      return;
    }

    this.verifyingPaymentId = payment.paymentId;
    this.errorMessage = '';
    this.successMessage = '';

    this.paymentService
      .verifyPayment(payment.paymentId)
      .subscribe({
        next: (response) => {
          this.successMessage =
            response?.message ??
            'Payment verified successfully.';

          this.verifyingPaymentId = null;
          this.loadPendingPayments();
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Verify payment error:', error);

          this.errorMessage =
            error?.error?.message ??
            'Unable to verify payment.';

          this.verifyingPaymentId = null;
          this.cdr.detectChanges();
        }
      });
  }
}

