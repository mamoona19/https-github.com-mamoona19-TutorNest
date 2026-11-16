import { Component,ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService,PendingDemoRequest,TutorDemoAvailability } from '../../Services/admin.service';
import {
  PaymentAccountService,
  PendingTutorPayout,
  PayoutMethod,
  VerifiedPaymentForTutorPayoutDto,
  
} from '../../Services/payment-account.service';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-admin-applications',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-applications.html',
  styleUrl: './admin-applications.css'
})
export class AdminApplicationsComponent {

  applications: any[] = [];

  isLoading = false;
  errorMessage = '';
  pendingDemoRequests: any[] = [];
isLoadingDemos = false;
demoError = '';
selectedDemo: any = null;
demoAvailability: TutorDemoAvailability[] = [];
isLoadingAvailability = false;
availabilityError = '';
// Tutor Payouts
pendingTutorPayouts: PendingTutorPayout[] = [];
payoutMethods: PayoutMethod[] = [];

isLoadingPayouts = false;
payoutError = '';
payoutSuccess = '';

creatingPayoutPaymentId: number | null = null;
releasingPayoutId: number | null = null;

selectedPayoutMethods: { [paymentId: number]: number } = {};
transactionReferences: { [payoutId: number]: string } = {};
verifiedPayments: VerifiedPaymentForTutorPayoutDto[] = [];
isLoadingVerifiedPayments = false;
pendingInvoices: any[] = [];
isLoadingPendingInvoices = false;
pendingInvoicesError = '';
pendingPayments: any[] = [];
isLoadingPendingPayments = false;
pendingPaymentsError = '';
selectedMeetingModeId: number | null = null;
meetingLink = '';
meetingAddress = '';

 constructor(private adminService: AdminService,private cdr: ChangeDetectorRef,
  private paymentAccountService: PaymentAccountService
 ) {

  console.log('ADMIN COMPONENT CREATED');

  
}
ngOnInit(): void {
  this.loadApplications();
  this.loadPendingDemoRequests();
  this.loadPendingTutorPayouts();
  this.loadPayoutMethods();
  this.loadVerifiedPaymentsForTutorPayout();
  this.loadPendingInvoices();
  this.loadPendingPayments();
   this.loadMeetingModes();
}
loadApplications(): void {

  this.isLoading = true;

  this.adminService.getTutorApplications().subscribe({

    next: (response) => {

      this.applications = [...response];

      console.log(
        'APPLICATIONS:',
        this.applications.length
      );

      this.isLoading = false;

      this.cdr.detectChanges();
    },

    error: (error) => {

      console.error('API ERROR:', error);

      this.errorMessage =
        error?.error?.message ||
        'Unable to load tutor applications.';

      this.isLoading = false;

      this.cdr.detectChanges();
    }

  });
}

  approveApplication(application: any): void {
  this.adminService.updateTutorApplication(
    application.requestTutorId,
    'Accepted',
    'Approved by Admin'
  ).subscribe({
    next: () => {
      this.loadApplications();
    },
    error: (error) => {
      console.error('APPROVE ERROR:', error);
    }
  });
}

  rejectApplication(application: any): void {
  this.adminService.updateTutorApplication(
    application.requestTutorId,
    'Rejected',
    'Rejected by Admin'
  ).subscribe({
    next: () => {
      this.loadApplications();
    },
    error: (error) => {
      console.error('REJECT ERROR:', error);
    }
  });
}
  loadPendingDemoRequests(): void {
  this.isLoadingDemos = true;
  this.demoError = '';

  this.adminService.getPendingDemoRequests().subscribe({
    next: (response) => {
      console.log('PENDING DEMOS RESPONSE:', response);
      this.pendingDemoRequests = response || [];
      this.isLoadingDemos = false;
    },
    error: (error) => {
      console.error('PENDING DEMOS ERROR:', error);
      this.pendingDemoRequests = [];
      this.isLoadingDemos = false;
      this.demoError = 'Unable to load pending demo requests.';
    }
  });
}
showDemoAvailability(demo: any): void {
  this.selectedDemo = demo;
  this.demoAvailability = [];
  this.selectedMeetingModeId = null;
  this.meetingLink = '';
  this.meetingAddress = '';
  this.isLoadingAvailability = true;
  this.availabilityError = '';

  this.adminService
    .getDemoAvailability(demo.tutorDemoRequestId)
    .subscribe({
      next: (response) => {
        console.log('DEMO AVAILABILITY:', response);

        this.demoAvailability = response || [];

        this.isLoadingAvailability = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('AVAILABILITY ERROR:', error);

        this.demoAvailability = [];
        this.isLoadingAvailability = false;
        this.availabilityError =
          error?.error?.message ||
          'Unable to load demo availability.';

        this.cdr.detectChanges();
      }
    });
}

selectDemoSlot(
  demo: any,
  slot: TutorDemoAvailability
): void {

  const selectedMode = this.meetingModes.find(
    mode =>
      Number(mode.MeetingModeId) ===
      Number(this.selectedMeetingModeId)
  );

  if (!selectedMode) {
    this.availabilityError = 'Please select a meeting mode.';
    return;
  }

  const modeName = String(selectedMode.MeetingModeName)
    .trim()
    .toLowerCase();

  if (modeName === 'online' && !this.meetingLink.trim()) {
    this.availabilityError = 'Please enter the online meeting link.';
    return;
  }

  if (
    (modeName === 'home' || modeName === 'academy') &&
    !this.meetingAddress.trim()
  ) {
    this.availabilityError = 'Please enter the meeting address.';
    return;
  }

  const request = {
    tutorDemoRequestId: demo.tutorDemoRequestId,
    availabilityId: slot.availabilityId,
    meetingModeId: Number(selectedMode.MeetingModeId),

    meetingLink: modeName === 'online'
      ? this.meetingLink.trim()
      : null,

    meetingAddress: modeName !== 'online'
      ? this.meetingAddress.trim()
      : null,

    adminRemarks: 'Demo scheduled by Admin.'
  };

  this.adminService.scheduleTutorDemo(request).subscribe({
    next: (response: any) => {
      console.log('DEMO SCHEDULED:', response);

      this.selectedDemo = null;
      this.demoAvailability = [];
      this.selectedMeetingModeId = null;
      this.meetingLink = '';
      this.meetingAddress = '';
      this.availabilityError = '';

      this.loadPendingDemoRequests();
      this.loadApplications();
    },
    error: (error: any) => {
      console.error('SCHEDULE DEMO ERROR:', error);

      this.availabilityError =
        error?.error?.message ||
        'Unable to schedule demo.';

      this.cdr.detectChanges();
    }
  });
}

selectTutor(application: any): void {

  const confirmed = confirm(
    `Are you sure you want to select Tutor #${application.tutorId} for Tuition Request #${application.tuitionRequestId}?`
  );

  if (!confirmed) {
    return;
  }

  console.log(
    'SELECT TUTOR:',
    application.requestTutorId
  );

  this.adminService
    .selectTutor(application.requestTutorId)
    .subscribe({

      next: (response: any) => {

        console.log(
          'TUTOR SELECTED:',
          response
        );

        this.loadApplications();
      },

      error: (error: any) => {

        console.error(
          'SELECT TUTOR ERROR:',
          error
        );

        this.errorMessage =
          error?.error?.message ||
          'Unable to select tutor.';

        this.cdr.detectChanges();
      }

    });
}
isTutorSelected(application: any): boolean {

  return application.isSelected === true ||
         application.isSelected === 1;
}



isAnotherTutorSelected(application: any): boolean {
  return application.applicationStatus === 'Assigned to Another Tutor';
}

loadPendingTutorPayouts(): void {
  this.isLoadingPayouts = true;
  this.payoutError = '';

  this.paymentAccountService.getPendingTutorPayouts().subscribe({
    next: (response: any) => {
      this.pendingTutorPayouts = response?.data ?? [];
      this.isLoadingPayouts = false;
      this.cdr.detectChanges();
    },
    error: (error: any) => {
      this.pendingTutorPayouts = [];
      this.isLoadingPayouts = false;
      this.payoutError =
        error?.error?.message || 'Unable to load tutor payouts.';
      this.cdr.detectChanges();
    }
  });
}

loadPayoutMethods(): void {
  this.paymentAccountService.getPayoutMethods().subscribe({
    next: (response: any) => {
      this.payoutMethods = response?.data ?? [];
      this.cdr.detectChanges();
    },
    error: (error: any) => {
      this.payoutError =
        error?.error?.message || 'Unable to load payout methods.';
      this.cdr.detectChanges();
    }
  });
}

createTutorPayout(paymentId: number): void {
  const payoutMethodId = this.selectedPayoutMethods[paymentId];

  if (!payoutMethodId) {
    this.payoutError = 'Please select a payout method.';
    return;
  }

  this.creatingPayoutPaymentId = paymentId;
  this.payoutError = '';
  this.payoutSuccess = '';

  this.paymentAccountService.createTutorPayout({
    paymentId,
    payoutMethodId
  }).subscribe({
    next: (response: any) => {
      this.payoutSuccess =
        response?.message || 'Tutor payout created successfully.';
      this.creatingPayoutPaymentId = null;
      this.loadPendingTutorPayouts();
      this.loadVerifiedPaymentsForTutorPayout();
      this.cdr.detectChanges();
    },
    error: (error: any) => {
      this.payoutError =
        error?.error?.message || 'Unable to create tutor payout.';
      this.creatingPayoutPaymentId = null;
      this.cdr.detectChanges();
    }
  });
}

releaseTutorPayout(tutorPayoutId: number): void {
  if (this.releasingPayoutId !== null) {
    return;
  }

  const transactionReference =
    this.transactionReferences[tutorPayoutId]?.trim();

  if (!transactionReference) {
    this.payoutError = 'Enter the actual transaction reference.';
    this.payoutSuccess = '';
    return;
  }

  const confirmed = confirm(
    'Confirm that you have manually paid the tutor and verified the transaction reference?'
  );

  if (!confirmed) {
    return;
  }

  this.releasingPayoutId = tutorPayoutId;
  this.payoutError = '';
  this.payoutSuccess = '';

  this.paymentAccountService.releaseTutorPayout(
    tutorPayoutId,
    { transactionReference }
  ).subscribe({
    next: (response: any) => {
      this.payoutSuccess =
        response?.data?.message ||
        'Tutor payout released successfully.';

      this.loadPendingTutorPayouts();
      this.releasingPayoutId = null;
      this.cdr.detectChanges();
    },
    error: (error: any) => {
      this.payoutError =
        error?.error?.message ||
        'Unable to release tutor payout.';

      this.releasingPayoutId = null;
      this.cdr.detectChanges();
    }
  });
}

loadVerifiedPaymentsForTutorPayout(): void {
  this.isLoadingVerifiedPayments = true;
  this.payoutError = '';

  this.paymentAccountService
    .getVerifiedPaymentsForTutorPayout()
    .subscribe({
      next: (response) => {
  this.verifiedPayments = response.data ?? [];
  this.isLoadingVerifiedPayments = false;
  this.cdr.detectChanges();
},
      error: (error: any) => {
        this.verifiedPayments = [];
        this.isLoadingVerifiedPayments = false;
        this.payoutError =
          error?.error?.message ||
          'Unable to load eligible verified payments.';
        this.cdr.detectChanges();
      }
    });
}
loadPendingInvoices(): void {
  this.isLoadingPendingInvoices = true;
  this.pendingInvoicesError = '';

  this.paymentAccountService
    .getPendingInvoicesForAdmin()
    .subscribe({
      next: (response: any) => {
        this.pendingInvoices = response?.data ?? [];
        this.isLoadingPendingInvoices = false;
        this.cdr.detectChanges();
      },
      error: (error: any) => {
  console.error('PENDING INVOICES ERROR:', error);
  console.error('HTTP STATUS:', error.status);
  console.error('ERROR BODY:', error.error);
  console.error('REQUEST URL:', error.url);

  this.pendingInvoices = [];
  this.isLoadingPendingInvoices = false;

  this.pendingInvoicesError =
    `Unable to load invoices. HTTP ${error.status}.`;

  this.cdr.detectChanges();
}
    });
}

loadPendingPayments(): void {
  this.isLoadingPendingPayments = true;
  this.pendingPaymentsError = '';

  this.paymentAccountService
    .getPendingPaymentsForAdmin()
    .subscribe({
      next: (response: any) => {
        this.pendingPayments = response?.data ?? [];
        this.isLoadingPendingPayments = false;
        this.cdr.detectChanges();
      },
      error: (error: any) => {
        console.error('PENDING PAYMENTS ERROR:', error);

        this.pendingPayments = [];
        this.isLoadingPendingPayments = false;
        this.pendingPaymentsError =
          `Unable to load pending payments. HTTP ${error.status}.`;

        this.cdr.detectChanges();
      }
    });
}

verifyPayment(paymentId: number): void {
  const confirmed = window.confirm(
    'Have you confirmed that the payment has actually been received? Verifying will activate the tuition.'
  );

  if (!confirmed) {
    return;
  }

  this.paymentAccountService.verifyPayment(paymentId).subscribe({
    next: (response: any) => {
      if (response?.success === false) {
        alert(response.message || 'Payment verification failed.');
        return;
      }

      alert('Payment verified successfully.');
      this.loadPendingPayments();

      // Refresh pending invoices if this method exists in your component.
      if (typeof this.loadPendingInvoices === 'function') {
        this.loadPendingInvoices();
      }
    },
    error: (error: any) => {
      console.error('VERIFY PAYMENT ERROR:', error);

      alert(
        error?.error?.message ||
        'Unable to verify payment. Please try again.'
      );
    }
  });
}



meetingModes: any[] = [];



get selectedMeetingModeName(): string {
  return this.meetingModes.find(
    mode => Number(mode.MeetingModeId) ===
      Number(this.selectedMeetingModeId)
  )?.MeetingModeName ?? '';
}

loadMeetingModes(): void {
  this.adminService.getMeetingModes().subscribe({
    next: (response: any) => {
      this.meetingModes = response?.data ?? response ?? [];
      this.cdr.detectChanges();
      console.log('MEETING MODES:', this.meetingModes);
    },
    error: (error: any) => {
      console.error('LOAD MEETING MODES ERROR:', error);
      this.availabilityError = 'Unable to load meeting modes.';
      this.cdr.detectChanges();
    }
  });
}

}