import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface PaymentAccount {
  paymentAccountId: number;

  paymentMethodId: number;
  paymentMethodName: string;

  paymentGatewayId: number | null;
  paymentGatewayName: string | null;

  accountName: string;

  bankName: string | null;
  accountNumber: string | null;
  iban: string | null;
  mobileNumber: string | null;

  instructions: string | null;

  isActive: boolean;

  createdDate: string;
  createdBy: number;

  updatedDate: string | null;
  updatedBy: number | null;
}

export interface SavePaymentAccount {
  paymentMethodId: number;
  paymentGatewayId: number | null;

  accountName: string;

  bankName: string | null;
  accountNumber: string | null;
  iban: string | null;
  mobileNumber: string | null;

  instructions: string | null;
}
export interface VerifiedPaymentForTutorPayoutDto {
  paymentId: number;
  tuitionContractId: number;
  tuitionRequestId: number;
  tutorId: number;
  amount: number;
  paymentDate: string | null;
  createdDate: string;
  paymentStatusName: string;
}
export interface PaymentMethod {
  paymentMethodId: number;
  paymentMethodName: string;
}

export interface PaymentGateway {
  paymentGatewayId: number;
  paymentGatewayName: string;
}
export interface PendingTutorPayout {
  tutorPayoutId: number;
  paymentId: number;
  tuitionContractId: number;
  tutorId: number;
  grossAmount: number;
  commissionPercentage: number;
  commissionAmount: number;
  netPayoutAmount: number;
  holdUntilDate: string | null;
  payoutStatusName: string;
  payoutMethodName: string;
  transactionReference: string | null;
  paidDate: string | null;
  createdDate: string;
}

export interface PayoutMethod {
  payoutMethodId: number;
  payoutMethodName: string;
}

export interface CreateTutorPayout {
  paymentId: number;
  payoutMethodId: number;
}

export interface ReleaseTutorPayout {
  transactionReference: string;
}
@Injectable({
  providedIn: 'root'
})
export class PaymentAccountService {

  private apiUrl =
    'https://localhost:44351/api/Payment/admin/payment-accounts';

  constructor(
    private http: HttpClient
  ) {}

  getPaymentAccounts(): Observable<any> {

    return this.http.get<any>(
      this.apiUrl
    );
  }

  savePaymentAccount(
    request: SavePaymentAccount
  ): Observable<any> {

    return this.http.post<any>(
      this.apiUrl,
      request
    );
  }

  updatePaymentAccount(
    paymentAccountId: number,
    request: SavePaymentAccount
  ): Observable<any> {

    return this.http.put<any>(
      `${this.apiUrl}/${paymentAccountId}`,
      request
    );
  }

  updatePaymentAccountStatus(
    paymentAccountId: number,
    isActive: boolean
  ): Observable<any> {

    return this.http.patch<any>(
      `${this.apiUrl}/${paymentAccountId}/status`,
      {
        isActive
      }
    );
  }
  getPaymentMethods(): Observable<any> {
  return this.http.get<any>(
    `${this.apiUrl.replace('/admin/payment-accounts', '')}/admin/payment-methods`
  );
}

getPaymentGateways(): Observable<any> {
  return this.http.get<any>(
    `${this.apiUrl.replace('/admin/payment-accounts', '')}/admin/payment-gateways`
  );
}

getPendingPayments(): Observable<any> {
  return this.http.get<any>(
    'https://localhost:44351/api/Payment/admin/pending-payments'
  );
}

verifyPayment(paymentId: number): Observable<any> {
  return this.http.post<any>(
    `https://localhost:44351/api/Payment/admin/verify/${paymentId}`,
    {}
  );
}
// Load pending tutor payouts
getPendingTutorPayouts(): Observable<any> {
  return this.http.get<any>(
    `${this.apiUrl.replace('/admin/payment-accounts', '')}/admin/pending-tutor-payouts`
  );
}

// Create a tutor payout
createTutorPayout(
  request: CreateTutorPayout
): Observable<any> {
  return this.http.post<any>(
    `${this.apiUrl.replace('/admin/payment-accounts', '')}/admin/tutor-payouts`,
    request
  );
}

// Release payout after manual payment
releaseTutorPayout(
  tutorPayoutId: number,
  request: ReleaseTutorPayout
): Observable<any> {
  return this.http.post<any>(
    `${this.apiUrl.replace('/admin/payment-accounts', '')}/admin/tutor-payouts/${tutorPayoutId}/release`,
    request
  );
}

// Load payout methods from database
getPayoutMethods(): Observable<any> {
  return this.http.get<any>(
    `${this.apiUrl.replace('/admin/payment-accounts', '')}/admin/payout-methods`
  );
}

getVerifiedPaymentsForTutorPayout():
  Observable<{ success: boolean; data: VerifiedPaymentForTutorPayoutDto[] }> {

  return this.http.get<{
    success: boolean;
    data: VerifiedPaymentForTutorPayoutDto[];
  }>(
    'https://localhost:44351/api/Payment/admin/verified-payments-for-tutor-payout'
  );
}

getActivePaymentAccounts(): Observable<any> {
  return this.http.get<any>(
    'https://localhost:44351/api/Payment/active-payment-accounts'
  );
}
getPendingInvoicesForAdmin(): Observable<any> {
  return this.http.get<any>(
    'https://localhost:44351/api/Payment/admin/pending-invoices'
  );
}

getPendingPaymentsForAdmin(): Observable<any> {
  return this.http.get<any>(
    'https://localhost:44351/api/Payment/pending-payments'
  );
}





}