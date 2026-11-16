import { Component, OnInit,ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';


import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import {
  TuitionRequestService,
  MyTuitionRequest,
  TutorApplication
} from '../../Services/tuition-request.service';

import {
  Student,
  StudentService
} from '../../Services/student.service';

import {
  Subject,
  SubjectService
} from '../../Services/subject.service';

import {
  City,
  CityService
} from '../../Services/city.service';

import {
  Area,
  AreaService
} from '../../Services/area.service';

import { ParentService,Invoice,CreatePaymentRequest } from '../../Services/parent.service';
import {
  PaymentAccountService,
  PaymentAccount
} from '../../Services/payment-account.service';


@Component({
  selector: 'app-parent-dashboard',

  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ],

  templateUrl: './parent-dashboard.html',
  styleUrl: './parent-dashboard.css'
})
export class ParentDashboard implements OnInit {
  confirmingDemoId: number | null = null;
  showAllRequests = false;
  showAllInvoices = false;
    // =====================================================
  // INVOICES
  // =====================================================

  invoices: any[] = [];
  isLoadingInvoices = false;
  invoicesError = '';
  // =====================================================
// PAYMENT
// =====================================================

showPaymentModal = false;

selectedInvoice: any = null;

paymentMethodId = 0;
paymentGatewayId = 0;

transactionReference = '';

isCreatingPayment = false;

paymentMessage = '';
paymentMessageType: 'success' | 'error' = 'success';

  // =====================================================
  // REQUEST FORM
  // =====================================================

  requestForm: FormGroup;
demoMessage = '';
demoMessageType: 'success' | 'error' = 'success';

  // =====================================================
  // STUDENTS
  // =====================================================

  students: Student[] = [];

  isLoadingStudents = false;
  studentError = '';

  showRequestForm = false;


  // =====================================================
  // SUBJECTS
  // =====================================================

  subjects: Subject[] = [];

  isLoadingSubjects = false;
  subjectError = '';


  // =====================================================
  // CITIES
  // =====================================================

  cities: City[] = [];

  isLoadingCities = false;
  cityError = '';


  // =====================================================
  // AREAS
  // =====================================================

  areas: Area[] = [];

  isLoadingAreas = false;
  areaError = '';


  // =====================================================
  // PARENT
  // =====================================================

  parentId = 0;


  // =====================================================
  // REQUEST SUBMIT
  // =====================================================

  loading = false;

  successMessage = '';
  errorMessage = '';


  // =====================================================
  // MY TUITION REQUESTS
  // =====================================================

  myRequests: MyTuitionRequest[] = [];

  isLoadingRequests = false;
  requestsError = '';

// =====================================================
// MY TUITION REQUESTS - FILTER & PAGINATION
// =====================================================

selectedRequestFilter: 'All' | 'Pending' | 'Active' | 'Completed' = 'All';

currentRequestPage = 1;
requestsPerPage = 2;

// Summary counts

get matchedRequestsCount(): number {
  return this.myRequests.filter(r =>
    (r.statusName || '').toLowerCase().includes('matched')
  ).length;
}

get cancelledRequestsCount(): number {
  return this.myRequests.filter(r =>
    (r.statusName || '').toLowerCase().includes('cancelled')
  ).length;
}

// Demo Analytics
get totalDemosCount(): number {
  return this.parentDemoRequests.length;
}

get pendingDemosCount(): number {
  return this.parentDemoRequests.filter(d =>
    (d.demoStatusName || '').toLowerCase().includes('pending')
  ).length;
}

get scheduledDemosCount(): number {
  return this.parentDemoRequests.filter(d =>
    (d.demoStatusName || '').toLowerCase().includes('scheduled')
  ).length;
}

get completedDemosCount(): number {
  return this.parentDemoRequests.filter(d =>
    (d.demoStatusName || '').toLowerCase().includes('completed')
  ).length;
}

get totalRequests(): number {
  return this.myRequests.length;
}

get pendingRequestsCount(): number {
  return this.myRequests.filter(r =>
    (r.statusName || '').toLowerCase().includes('pending')
  ).length;
}

get activeRequestsCount(): number {
  return this.myRequests.filter(r =>
    (r.statusName || '').toLowerCase().includes('active')
  ).length;
}

get completedRequestsCount(): number {
  return this.myRequests.filter(r =>
    (r.statusName || '').toLowerCase().includes('completed')
  ).length;
}

// Tutor Applications Analytics
allTutorApplications: TutorApplication[] = [];
isLoadingApplicationAnalytics = false;

get totalApplicationsCount(): number {
  return this.allTutorApplications.length;
}

get acceptedApplicationsCount(): number {
  return this.allTutorApplications.filter(a =>
    (a.applicationStatus || '').toLowerCase().includes('accepted')
  ).length;
}

get pendingApplicationsCount(): number {
  return this.allTutorApplications.filter(a =>
    (a.applicationStatus || '').toLowerCase().includes('pending')
  ).length;
}

get rejectedApplicationsCount(): number {
  return this.allTutorApplications.filter(a =>
    (a.applicationStatus || '').toLowerCase().includes('rejected')
  ).length;
}

// Filter requests
get filteredRequests(): MyTuitionRequest[] {

  if (this.selectedRequestFilter === 'All') {
    return this.myRequests;
  }

  return this.myRequests.filter(request => {

    const status = (request.statusName || '').toLowerCase();

    switch (this.selectedRequestFilter) {

      case 'Pending':
        return status.includes('pending');

      case 'Active':
        return status.includes('active');

      case 'Completed':
        return status.includes('completed');

      default:
        return true;
    }
  });
}

// Paginated requests
get paginatedRequests(): MyTuitionRequest[] {

  const startIndex =
    (this.currentRequestPage - 1) * this.requestsPerPage;

  return this.filteredRequests.slice(
    startIndex,
    startIndex + this.requestsPerPage
  );
}

get totalRequestPages(): number {
  return Math.ceil(
    this.filteredRequests.length / this.requestsPerPage
  );
}

get requestStartNumber(): number {
  if (this.filteredRequests.length === 0) {
    return 0;
  }

  return (this.currentRequestPage - 1) *
    this.requestsPerPage + 1;
}

get requestEndNumber(): number {
  return Math.min(
    this.currentRequestPage * this.requestsPerPage,
    this.filteredRequests.length
  );
}

 // Invoice Analytics
get totalInvoicesCount(): number {
  return this.invoices.length;
}

get pendingInvoicesCount(): number {
  return this.invoices.filter(i =>
    (i.invoiceStatusName || '').toLowerCase().includes('pending')
  ).length;
}

get paidInvoicesCount(): number {
  return this.invoices.filter(i =>
    (i.invoiceStatusName || '').toLowerCase() === 'paid'
  ).length;
}

get overdueInvoicesCount(): number {
  return this.invoices.filter(i =>
    (i.invoiceStatusName || '').toLowerCase().includes('overdue')
  ).length;
}

// Payment Summary
get totalPaidAmount(): number {
  return this.invoices
    .filter(i =>
      (i.invoiceStatusName || '').toLowerCase() === 'paid'
    )
    .reduce((total, i) => total + Number(i.netAmount || 0), 0);
}

get pendingPaymentAmount(): number {
  return this.invoices
    .filter(i => {
      const status = (i.invoiceStatusName || '').toLowerCase();
      return status === 'pending' || status === 'overdue';
    })
    .reduce((total, i) => total + Number(i.netAmount || 0), 0);
}

// Change filter
filterRequests(
  filter: 'All' | 'Pending' | 'Active' | 'Completed'
): void {

  this.selectedRequestFilter = filter;
  this.currentRequestPage = 1;

  // Close expanded applications when changing filter
  this.closeTutorApplications();
}

// Pagination
changeRequestPage(page: number): void {

  if (page < 1 || page > this.totalRequestPages) {
    return;
  }

  this.currentRequestPage = page;

  this.closeTutorApplications();
}
  // =====================================================
  // TUTOR APPLICATIONS
  // =====================================================

  selectedRequestId: number | null = null;

  tutorApplications: TutorApplication[] = [];

  isLoadingApplications = false;
  applicationsError = '';

  parentDemoRequests: any[] = [];
isLoadingDemos = false;

// =====================================================
// MANUAL PAYMENT ACCOUNT DETAILS
// =====================================================

paymentAccounts: PaymentAccount[] = [];
isLoadingPaymentAccounts = false;
paymentAccountsError = '';


  // =====================================================
  // CONSTRUCTOR
  // =====================================================

  constructor(
    private fb: FormBuilder,
    private tuitionRequestService: TuitionRequestService,
    private studentService: StudentService,
    private subjectService: SubjectService,
    private cityService: CityService,
    private areaService: AreaService,
    private parentService: ParentService,
    private paymentAccountService: PaymentAccountService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {

    // Get logged-in user ID
    this.parentId = Number(
      localStorage.getItem('userId')
    );


    // =====================================================
    // REQUEST FORM
    // =====================================================

    this.requestForm = this.fb.group({

      studentId: [
        '',
        Validators.required
      ],

      tuitionTypeId: [
        1,
        Validators.required
      ],

      subjectId: [
        '',
        Validators.required
      ],

      cityId: [
        '',
        Validators.required
      ],

      areaId: [
        '',
        Validators.required
      ],

      budget: [
        18000,
        [
          Validators.required,
          Validators.min(1)
        ]
      ],

      preferredTutorGenderId: [
        0
      ],

      preferredStartDate: [
        '',
        Validators.required
      ],

      specialInstructions: [
        ''
      ]
    });
  }


  // =====================================================
  // ON INIT
  // =====================================================

ngOnInit(): void {

  this.loadStudents();
  this.loadSubjects();
  this.loadCities();

  this.loadParentId();
  this.loadParentDemoRequests();
  this.loadInvoices();
  this.loadActivePaymentAccounts();
}

  // =====================================================
  // LOAD MY TUITION REQUESTS
  // =====================================================

 loadMyTuitionRequests(): void {

  console.log('STEP 4: Loading My Tuition Requests...');

  this.isLoadingRequests = true;
  this.requestsError = '';

  this.tuitionRequestService
    .getMyTuitionRequests()
    .subscribe({

      next: (requests) => {

        console.log(
          'STEP 5: API REQUESTS:',
          requests
        );

        this.myRequests = requests || [];
        this.loadApplicationAnalytics();
        this.cdr.detectChanges();

        console.log(
          'STEP 6: myRequests:',
          this.myRequests
        );

        console.log(
          'STEP 7: COUNT:',
          this.myRequests.length
        );

        this.isLoadingRequests = false;
this.cdr.detectChanges();

        // IMPORTANT TEST
        setTimeout(() => {

          console.log(
            'STEP 8 - AFTER 2 SECONDS:',
            this.myRequests.length
          );

          console.log(
            'STEP 8 DATA:',
            this.myRequests
          );

        }, 2000);

      },

      error: (error) => {

        console.error(
          'STEP ERROR: My Tuition Requests:',
          error
        );

        this.myRequests = [];

        this.isLoadingRequests = false;

        this.requestsError =
          'Unable to load your tuition requests.';
      }
    });
}


  // =====================================================
  // LOAD STUDENTS
  // =====================================================

  loadStudents(): void {

    this.isLoadingStudents = true;

    this.studentError = '';

    this.studentService
      .getMyStudents()
      .subscribe({

        next: (students) => {

          this.students = students || [];

          this.isLoadingStudents = false;


          // Automatically select first child
          if (this.students.length > 0) {

            this.requestForm.patchValue({

              studentId:
                this.students[0].studentId

            });

          } else {

            this.studentError =
              'No children found. Please add a child first.';
          }
        },

        error: (error) => {

          console.error(
            'Student API Error:',
            error
          );

          this.students = [];

          this.studentError =
            `Unable to load students. Status: ${error.status}`;

          this.isLoadingStudents = false;
        }
      });
  }


  // =====================================================
  // SUBMIT TUITION REQUEST
  // =====================================================

  submitRequest(): void {

    // Clear old messages
    this.successMessage = '';
    this.errorMessage = '';


    // =====================================================
    // VALIDATE FORM
    // =====================================================

    if (this.requestForm.invalid) {

      this.requestForm.markAllAsTouched();

      return;
    }


    // =====================================================
    // VALIDATE PARENT
    // =====================================================

    if (!this.parentId) {

      this.errorMessage =
        'Unable to identify logged-in parent.';

      return;
    }


    // =====================================================
    // START LOADING
    // =====================================================

    this.loading = true;


    const formValue =
      this.requestForm.value;


    // =====================================================
    // REQUEST OBJECT
    // =====================================================

    const request = {

      parentId:
        this.parentId,

      studentId:
        Number(formValue.studentId),

      tuitionTypeId:
        Number(formValue.tuitionTypeId),

      subjectId:
        Number(formValue.subjectId),

      cityId:
        Number(formValue.cityId),

      areaId:
        Number(formValue.areaId),

      budget:
        Number(formValue.budget),

      preferredTutorGenderId:
        Number(formValue.preferredTutorGenderId),

      preferredStartDate:
        formValue.preferredStartDate,

      specialInstructions:
        formValue.specialInstructions,

      createdBy:
        this.parentId
    };


    console.log(
      'Tuition Request:',
      request
    );


    // =====================================================
    // CREATE REQUEST
    // =====================================================

    this.tuitionRequestService
      .createTuitionRequest(request)
      .subscribe({

        next: (response) => {

          console.log(
            'Request created:',
            response
          );


          // =================================================
          // SUCCESS
          // =================================================

          this.successMessage =
            'Tuition request submitted successfully.';


          // Stop submit button loading
          this.loading = false;


          // =================================================
          // CLOSE FORM
          // =================================================

          this.showRequestForm = false;


          // =================================================
          // RESET FORM
          // =================================================

          this.requestForm.reset({

            studentId:
              this.students.length > 0
                ? this.students[0].studentId
                : '',

            tuitionTypeId:
              1,

            subjectId:
              this.subjects.length > 0
                ? this.subjects[0].subjectId
                : '',

            cityId:
              this.cities.length > 0
                ? this.cities[0].cityId
                : '',

            areaId:
              '',

            budget:
              18000,

            preferredTutorGenderId:
              0,

            preferredStartDate:
              '2026-09-30',

            specialInstructions:
              ''
          });


          // =================================================
          // REFRESH REQUEST LIST
          // =================================================

          this.loadMyTuitionRequests();
        },


        // ===================================================
        // ERROR
        // ===================================================

        error: (error) => {

          console.error(
            'Create request error:',
            error
          );


          this.errorMessage =
            error.error?.message ||
            'Unable to submit tuition request.';


          this.loading = false;
        }
      });
  }


  // =====================================================
  // LOAD SUBJECTS
  // =====================================================

  loadSubjects(): void {

    this.isLoadingSubjects = true;

    this.subjectError = '';

    this.subjectService
      .getSubjects()
      .subscribe({

        next: (subjects) => {

          this.subjects =
            subjects || [];

          this.isLoadingSubjects = false;
        },

        error: (error) => {

          console.error(
            'Error loading subjects:',
            error
          );

          this.subjects = [];

          this.subjectError =
            'Unable to load subjects.';

          this.isLoadingSubjects = false;
        }
      });
  }


  // =====================================================
  // LOAD CITIES
  // =====================================================

  loadCities(): void {

    this.isLoadingCities = true;

    this.cityError = '';

    this.cityService
      .getCities()
      .subscribe({

        next: (cities) => {

          this.cities =
            cities || [];

          this.isLoadingCities = false;
        },

        error: (error) => {

          console.error(
            'Error loading cities:',
            error
          );

          this.cities = [];

          this.cityError =
            'Unable to load cities.';

          this.isLoadingCities = false;
        }
      });
  }


  // =====================================================
  // LOAD AREAS BY CITY
  // =====================================================

  loadAreas(cityId: number): void {

    this.isLoadingAreas = true;

    this.areaError = '';

    this.areas = [];


    // No city selected
    if (!cityId) {

      this.isLoadingAreas = false;

      return;
    }


    this.areaService
      .getAreasByCity(cityId)
      .subscribe({

        next: (areas) => {

          this.areas =
            areas || [];

          this.isLoadingAreas = false;
        },

        error: (error) => {

          console.error(
            'Error loading areas:',
            error
          );

          this.areas = [];

          this.areaError =
            'Unable to load areas.';

          this.isLoadingAreas = false;
        }
      });
  }


  // =====================================================
  // LOAD PARENT ID
  // =====================================================

 loadParentId(): void {

  console.log('STEP 1: Getting parent ID...');

  this.parentService
    .getMyParentId()
    .subscribe({

      next: (response) => {

        console.log('STEP 2: Parent API response:', response);

        this.parentId = response.parentId;

        console.log(
          'STEP 3: Logged-in Parent ID:',
          this.parentId
        );

        this.loadMyTuitionRequests();
      },

      error: (error) => {

        console.error(
          'STEP ERROR: Parent ID Error:',
          error
        );

        this.errorMessage =
          'Unable to identify logged-in parent.';
      }
    });
}
  // =====================================================
  // LOAD TUTOR APPLICATIONS
  // =====================================================

  loadTutorApplications(tuitionRequestId: number): void {
  console.log('CLICKED REQUEST:', tuitionRequestId);

  this.selectedRequestId = tuitionRequestId;
  this.isLoadingApplications = true;
  this.applicationsError = '';
  this.tutorApplications = [];

  this.tuitionRequestService
    .getTutorApplications(tuitionRequestId)
    .subscribe({
      next: (applications) => {

        console.log('API RESPONSE:', applications);

        this.tutorApplications = applications || [];

        console.log(
          'APPLICATIONS ASSIGNED:',
          this.tutorApplications
        );

        this.isLoadingApplications = false;

        // IMPORTANT
        this.cdr.detectChanges();

        console.log(
          'LOADING:',
          this.isLoadingApplications
        );

        console.log(
          'COUNT:',
          this.tutorApplications.length
        );
      },

      error: (error) => {

        console.error(
          'APPLICATION API ERROR:',
          error
        );

        this.tutorApplications = [];
        this.isLoadingApplications = false;
        this.applicationsError =
          'Unable to load tutor applications.';

        // IMPORTANT
        this.cdr.detectChanges();
      }
    });
}

loadApplicationAnalytics(): void {

  if (this.myRequests.length === 0) {
    this.allTutorApplications = [];
    return;
  }

  this.isLoadingApplicationAnalytics = true;

  const requests = this.myRequests.map(request =>
    this.tuitionRequestService
      .getTutorApplications(request.tuitionRequestId)
      .pipe(
        catchError(error => {
          console.error(
            `Applications error for request ${request.tuitionRequestId}:`,
            error
          );
          return of([]);
        })
      )
  );

  forkJoin(requests).subscribe({

    next: (results) => {

      this.allTutorApplications = results.flat();

      this.isLoadingApplicationAnalytics = false;

      this.cdr.detectChanges();

      console.log(
        'ALL PARENT APPLICATIONS:',
        this.allTutorApplications
      );
    },

    error: (error) => {

      console.error(
        'APPLICATION ANALYTICS ERROR:',
        error
      );

      this.allTutorApplications = [];
      this.isLoadingApplicationAnalytics = false;

      this.cdr.detectChanges();
    }
  });
}


  // =====================================================
  // CLOSE TUTOR APPLICATIONS
  // =====================================================

  closeTutorApplications(): void {

    this.selectedRequestId = null;

    this.tutorApplications = [];

    this.isLoadingApplications = false;

    this.applicationsError = '';
  }

 requestDemoForSelectedTutors(): void {

  const selectedTutors =
    this.tutorApplications.filter(
      application => application.selectedForDemo
    );

  if (selectedTutors.length === 0) {
    this.demoMessage = 'Please select at least one tutor.';
    this.demoMessageType = 'error';
    return;
  }

  const tuitionRequestId =
    this.selectedRequestId;

  if (!tuitionRequestId) {
    this.demoMessage = 'Tuition request not selected.';
    this.demoMessageType = 'error';
    return;
  }

  this.demoMessage = '';

  selectedTutors.forEach(application => {

    const demoRequest = {
      tuitionRequestId: tuitionRequestId,
      requestTutorId: application.requestTutorId,
      parentId: this.parentId,
      tutorId: application.tutorId,
      parentRemarks:
        'I would like to arrange a demo.'
    };

    this.tuitionRequestService
      .requestTutorDemo(demoRequest)
      .subscribe({

        next: (response) => {

          application.selectedForDemo = false;
          application.demoRequested = true;
          application.demoStatusName =
            'Pending Admin Review';

          this.demoMessage =
            'Demo request submitted successfully.';

          this.demoMessageType = 'success';

          this.cdr.detectChanges();
        },

        error: (error) => {

          console.error(
            'DEMO REQUEST ERROR:',
            error
          );

          if (error.status === 400) {

            this.demoMessage =
              'Demo request has already been submitted for this tutor.';

          } else {

            this.demoMessage =
              'Unable to submit demo request. Please try again.';
          }

          this.demoMessageType = 'error';

          this.cdr.detectChanges();
        }

      });
  });
}
loadParentDemoRequests(): void {
  this.isLoadingDemos = true;

  this.parentService.getMyDemoRequests().subscribe({
    next: (data) => {
      this.parentDemoRequests = data;
      this.isLoadingDemos = false;

      console.log('PARENT DEMOS:', data);
    },
    error: (error) => {
      console.error('Error loading parent demos:', error);
      this.parentDemoRequests = [];
      this.isLoadingDemos = false;
    }
  });
}
requestDemo(application: TutorApplication): void {

  const request = {
    tuitionRequestId: application.tuitionRequestId,
    requestTutorId: application.requestTutorId,
    parentId: this.parentId,
    tutorId: application.tutorId,
    parentRemarks: 'I would like to arrange a demo.'
  };

  this.parentService.requestDemo(request).subscribe({
    next: (response: any) => {

      console.log('DEMO REQUESTED:', response);

      this.demoMessage = response?.message || 'Demo requested successfully.';
      this.demoMessageType = 'success';

      // Get fresh demo state from backend
      this.loadTutorApplications(application.tuitionRequestId);
    },

    error: (error: any) => {

      console.error('REQUEST DEMO ERROR:', error);

      this.demoMessage =
        error?.error?.message ||
        'Unable to request demo.';

      this.demoMessageType = 'error';
    }
  });
}
// =====================================================
// LOAD MY INVOICES
// =====================================================

// =====================================================
// LOAD MY INVOICES
// =====================================================

loadInvoices(): void {

  this.isLoadingInvoices = true;
  this.invoicesError = '';

  this.parentService
    .getMyInvoices()
    .subscribe({

      next: (response) => {

        console.log(
          'PARENT INVOICES:',
          response
        );

        if (response.success) {

          this.invoices =
            response.data || [];

        } else {

          this.invoices = [];

          this.invoicesError =
            'Unable to load invoices.';
        }

        this.isLoadingInvoices = false;

        this.cdr.detectChanges();
      },

      error: (error) => {

        console.error(
          'Error loading parent invoices:',
          error
        );

        this.invoices = [];

        this.isLoadingInvoices = false;

        this.invoicesError =
          error?.error?.message ||
          'Unable to load invoices.';

        this.cdr.detectChanges();
      }
    });
}
// =====================================================
// OPEN PAYMENT MODAL
// =====================================================

openPaymentModal(invoice: any): void {

  if (!invoice) {
    return;
  }

  // Only unpaid invoices can be paid
  if (invoice.invoiceStatusName === 'Paid') {
    return;
  }

  this.selectedInvoice = invoice;

  this.paymentMethodId = 0;
  this.paymentGatewayId = 0;
  this.transactionReference = '';

  this.paymentMessage = '';
  this.paymentMessageType = 'success';

  this.showPaymentModal = true;
}


// =====================================================
// CLOSE PAYMENT MODAL
// =====================================================

closePaymentModal(): void {

  if (this.isCreatingPayment) {
    return;
  }

  this.showPaymentModal = false;

  this.selectedInvoice = null;

  this.paymentMethodId = 0;
  this.paymentGatewayId = 0;
  this.transactionReference = '';

  this.paymentMessage = '';
}


// =====================================================
// CREATE PAYMENT
// =====================================================

payInvoice(): void {

  this.paymentMessage = '';

  // -----------------------------------------------
  // Validate invoice
  // -----------------------------------------------

  if (!this.selectedInvoice) {

    this.paymentMessage =
      'Please select an invoice.';

    this.paymentMessageType = 'error';

    return;
  }


  // -----------------------------------------------
  // Prevent paying already paid invoice
  // -----------------------------------------------

  if (
    this.selectedInvoice.invoiceStatusName === 'Paid'
  ) {

    this.paymentMessage =
      'This invoice has already been paid.';

    this.paymentMessageType = 'error';

    return;
  }


  // -----------------------------------------------
  // Validate payment method
  // -----------------------------------------------

  if (!this.paymentMethodId) {

    this.paymentMessage =
      'Please select a payment method.';

    this.paymentMessageType = 'error';

    return;
  }


  // -----------------------------------------------
  // Validate payment gateway
  // -----------------------------------------------

  if (!this.paymentGatewayId) {

    this.paymentMessage =
      'Please select a payment gateway.';

    this.paymentMessageType = 'error';

    return;
  }


  // -----------------------------------------------
  // Start loading
  // -----------------------------------------------

  this.isCreatingPayment = true;


  const request: CreatePaymentRequest = {

    invoiceId:
      Number(this.selectedInvoice.invoiceId),

    paymentMethodId:
      Number(this.paymentMethodId),

    paymentGatewayId:
      Number(this.paymentGatewayId),

    transactionReference:
      this.transactionReference?.trim() || undefined
  };


  console.log(
    'CREATE PAYMENT REQUEST:',
    request
  );


  // -----------------------------------------------
  // API
  // -----------------------------------------------

  this.parentService
    .createPayment(request)
    .subscribe({

      next: (response) => {

        console.log(
          'PAYMENT CREATED:',
          response
        );

        this.isCreatingPayment = false;


        if (response?.success) {

          this.paymentMessage =
            response.message ||
            'Payment submitted successfully and is pending verification.';

          this.paymentMessageType =
            'success';


          // -----------------------------------------
          // Refresh invoices
          // -----------------------------------------

          this.loadInvoices();


          // -----------------------------------------
          // Close modal after short delay
          // -----------------------------------------

          setTimeout(() => {

            this.closePaymentModal();

          }, 1500);

        } else {

          this.paymentMessage =
            response?.message ||
            'Unable to create payment.';

          this.paymentMessageType =
            'error';
        }
      },


      error: (error) => {

        console.error(
          'CREATE PAYMENT ERROR:',
          error
        );

        this.isCreatingPayment = false;

        this.paymentMessage =
          error?.error?.message ||
          'Unable to process payment. Please try again.';

        this.paymentMessageType =
          'error';
      }
    });
}

// =====================================================
// LOAD ACTIVE PAYMENT ACCOUNTS
// =====================================================

loadActivePaymentAccounts(): void {
  this.isLoadingPaymentAccounts = true;
  this.paymentAccountsError = '';

  this.paymentAccountService
    .getActivePaymentAccounts()
    .subscribe({
      next: (response: any) => {
        this.paymentAccounts =
          response?.success && Array.isArray(response.data)
            ? response.data
            : [];

        this.isLoadingPaymentAccounts = false;
        this.cdr.detectChanges();
      },

      error: (error: any) => {
        console.error(
          'ACTIVE PAYMENT ACCOUNTS ERROR:',
          error
        );

        this.paymentAccounts = [];
        this.isLoadingPaymentAccounts = false;
        this.paymentAccountsError =
          'Unable to load payment account details. Please try again later.';

        this.cdr.detectChanges();
      }
    });
}
confirmParentDemo(demo: any): void {

  const demoId = Number(demo.tutorDemoRequestId);

  if (!demoId || this.confirmingDemoId !== null) {
    return;
  }

  if (demo.demoStatusName?.toLowerCase() !== 'tutor confirmed') {
    return;
  }

  if (!confirm('Are you sure you want to confirm this demo?')) {
    return;
  }

  this.confirmingDemoId = demoId;

  this.parentService.confirmParentDemo(demoId).subscribe({

    next: (response) => {
      alert(response.message || 'Demo confirmed successfully.');

      this.loadParentDemoRequests();

      this.confirmingDemoId = null;
    },

    error: (error) => {
      console.error('PARENT DEMO CONFIRMATION ERROR:', error);

      alert(
        error.error?.message ||
        'Unable to confirm demo. Please try again.'
      );

      this.confirmingDemoId = null;
    }

  });
}

 goToProfile(): void {
  this.router.navigate(['/parent/profile']);
}
}