import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import {
PaymentAccount,
PaymentAccountService,
SavePaymentAccount,
PaymentMethod,
PaymentGateway
} from '../../Services/payment-account.service';

@Component({
selector: 'app-payment-account-settings',
standalone: true,
imports: [CommonModule, FormsModule],
templateUrl: './payment-account-settings.html',
styleUrl: './payment-account-settings.css'
})
export class PaymentAccountSettingsComponent implements OnInit {

paymentAccounts: PaymentAccount[] = [];
paymentMethods: PaymentMethod[] = [];
paymentGateways: PaymentGateway[] = [];

isLoading = false;
isSaving = false;
errorMessage = '';
successMessage = '';

showForm = false;
editingAccountId: number | null = null;

form: SavePaymentAccount = this.emptyForm();

constructor(
private paymentAccountService: PaymentAccountService,
private cdr: ChangeDetectorRef
) {}

ngOnInit(): void {
   
this.loadPaymentAccounts();
this.loadPaymentMethods();
this.loadPaymentGateways();
}

private emptyForm(): SavePaymentAccount {
return {
paymentMethodId: 0,
paymentGatewayId: null,
accountName: '',
bankName: '',
accountNumber: '',
iban: '',
mobileNumber: '',
instructions: ''
};
}





loadPaymentAccounts(): void {
  this.isLoading = true;
  this.errorMessage = '';

  alert('Step 1: Calling payment accounts API');

  this.paymentAccountService.getPaymentAccounts().subscribe({
    next: (response) => {
  this.paymentAccounts = Array.isArray(response?.data)
    ? response.data
    : [];

  this.isLoading = false;

  this.cdr.detectChanges();
},
    error: (error) => {
      alert('API error: ' + (error?.message || 'Unknown error'));

      this.isLoading = false;
      this.errorMessage =
        error?.error?.message || 'Unable to load payment accounts.';
    }
  });
}

loadPaymentMethods(): void {
this.paymentAccountService.getPaymentMethods().subscribe({
next: (response) => {
this.paymentMethods = response?.data ?? [];
},
error: () => {
this.errorMessage = 'Unable to load payment methods.';
}
});
}

loadPaymentGateways(): void {
this.paymentAccountService.getPaymentGateways().subscribe({
next: (response) => {
this.paymentGateways = response?.data ?? [];
},
error: () => {
this.errorMessage = 'Unable to load payment gateways.';
}
});
}

openAddForm(): void {
this.editingAccountId = null;
this.form = this.emptyForm();
this.errorMessage = '';
this.successMessage = '';
this.showForm = true;
}

openEditForm(account: PaymentAccount): void {
this.editingAccountId = account.paymentAccountId;


this.form = {
  paymentMethodId: account.paymentMethodId,
  paymentGatewayId: account.paymentGatewayId,
  accountName: account.accountName,
  bankName: account.bankName ?? '',
  accountNumber: account.accountNumber ?? '',
  iban: account.iban ?? '',
  mobileNumber: account.mobileNumber ?? '',
  instructions: account.instructions ?? ''
};

this.errorMessage = '';
this.successMessage = '';
this.showForm = true;


}

cancelForm(): void {
this.showForm = false;
this.editingAccountId = null;
this.form = this.emptyForm();
}

saveAccount(): void {
this.errorMessage = '';
this.successMessage = '';

if (
  !this.form.paymentMethodId ||
  !this.form.accountName.trim()
) {
  this.errorMessage = 'Payment method and account name are required.';
  return;
}

this.isSaving = true;

const request: SavePaymentAccount = {
  ...this.form,
  accountName: this.form.accountName.trim(),
  bankName: this.form.bankName?.trim() || null,
  accountNumber: this.form.accountNumber?.trim() || null,
  iban: this.form.iban?.trim() || null,
  mobileNumber: this.form.mobileNumber?.trim() || null,
  instructions: this.form.instructions?.trim() || null
};

const operation = this.editingAccountId !== null
  ? this.paymentAccountService.updatePaymentAccount(
      this.editingAccountId,
      request
    )
  : this.paymentAccountService.savePaymentAccount(request);

operation.subscribe({
  next: (response) => {
    this.isSaving = false;

    if (response?.success === false) {
      this.errorMessage =
        response?.message || 'Unable to save payment account.';
      return;
    }

    this.successMessage =
      response?.message ||
      (this.editingAccountId !== null
        ? 'Payment account updated successfully.'
        : 'Payment account added successfully.');

    this.cancelForm();
    this.loadPaymentAccounts();
  },
  error: (error) => {
    this.isSaving = false;
    this.errorMessage =
      error?.error?.message || 'Unable to save payment account.';
  }
});


}

toggleAccountStatus(account: PaymentAccount): void {
this.errorMessage = '';
this.successMessage = '';

const newStatus = !account.isActive;
const action = newStatus ? 'activate' : 'deactivate';

if (!confirm(`Are you sure you want to ${action} this payment account?`)) {
  return;
}

this.paymentAccountService
  .updatePaymentAccountStatus(account.paymentAccountId, newStatus)
  .subscribe({
    next: (response) => {
      if (response?.success === false) {
        this.errorMessage =
          response?.message || 'Unable to update account status.';
        return;
      }

      this.successMessage =
        response?.message || `Payment account ${action}d successfully.`;

      this.loadPaymentAccounts();
    },
    error: (error) => {
      this.errorMessage =
        error?.error?.message || 'Unable to update account status.';
    }
  });


}
}
