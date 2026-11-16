
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  TutorRequest,
  TutorRequestService
} from '../../Services/tutor-request.service';

interface AvailableTuitionRequest {
  tuitionRequestId: number;
  parentId: number;
  studentId: number;
  tuitionTypeId: number;
  cityId: number;
  areaId: number;
  budget: number;
  preferredStartDate: string;
  specialInstructions: string;
  statusId: number;
  subjectId: number;
}

interface ChartItem {
  label: string;
  count: number;
}

@Component({
  selector: 'app-tutor-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tutor-dashboard.html',
  styleUrl: './tutor-dashboard.css'
})
export class TutorDashboard implements OnInit {

  // Tutor information
  firstName = '';
  lastName = '';

  // Dashboard counts
  acceptedCount = 0;
  pendingDemoCount = 0;
  activeTuitionCount = 0;

  // Dashboard payout summary
  releasedPayout = 0;
  pendingPayout = 0;
  totalTutorEarnings = 0;

  // Dashboard charts
  applicationChart: ChartItem[] = [
    { label: 'Accepted', count: 0 },
    { label: 'Pending', count: 0 },
    { label: 'Rejected', count: 0 }
  ];

  demoChart: ChartItem[] = [
    { label: 'Pending', count: 0 },
    { label: 'Scheduled', count: 0 },
    { label: 'Completed', count: 0 },
    { label: 'Other', count: 0 }
  ];

  // API data
  myApplications: any[] = [];
  myDemoRequests: any[] = [];
  myActiveTuitions: any[] = [];

  tutorRequests: TutorRequest[] = [];
  availableRequests: AvailableTuitionRequest[] = [];

  // Loading and messages
  loading = true;
  errorMessage = '';
  applyMessage = '';

  // Demo availability
  availabilityMinDate = new Date().toISOString().split('T')[0];

  availabilityForm = {
    tutorDemoRequestId: 0,
    availableDate: '',
    startTime: '',
    endTime: '',
    tutorRemarks: ''
  };

  availabilityForms: {
    [demoId: number]: {
      availableDate: string;
      startTime: string;
      endTime: string;
      tutorRemarks: string;
    };
  } = {};

  availabilityMessages: { [demoId: number]: string } = {};
  availabilityErrors: { [demoId: number]: string } = {};
  availabilityLoading: { [demoId: number]: boolean } = {};

  availabilityMessage = '';
  availabilityError = '';

  constructor(
    private router: Router,
    private tutorRequestService: TutorRequestService,
    private cdr: ChangeDetectorRef
  ) {
    this.firstName = localStorage.getItem('firstName') || '';
    this.lastName = localStorage.getItem('lastName') || '';
  }

  ngOnInit(): void {
    this.loadAvailableRequests();
    this.loadMyApplications();
    this.loadMyDemoRequests();
    this.loadMyActiveTuitions();
  }

  // --------------------------------
  // Available Requests
  // --------------------------------

  loadAvailableRequests(): void {
    debugger
    this.loading = true;
    this.errorMessage = '';

    this.tutorRequestService.getAvailableTuitionRequests().subscribe({
      next: (response: any) => {
        this.availableRequests = Array.isArray(response)
          ? response
          : Array.isArray(response?.data)
            ? response.data
            : [];

        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error: any) => {
        console.error('AVAILABLE REQUEST ERROR:', error);

        this.availableRequests = [];
        this.loading = false;

        this.errorMessage =
          error?.error?.message ||
          'Unable to load available tuition requests.';

        this.cdr.detectChanges();
      }
    });
  }

  applyForRequest(request: AvailableTuitionRequest): void {
    const tutorRemarks = 'I am available for this tuition.';

    this.tutorRequestService
      .applyForTuitionRequest(request.tuitionRequestId, tutorRemarks)
      .subscribe({
        next: () => {
          this.applyMessage = 'Applied successfully.';

          this.availableRequests = this.availableRequests.filter(
            x => x.tuitionRequestId !== request.tuitionRequestId
          );

          this.cdr.detectChanges();
        },
        error: (error: any) => {
          console.error('Apply error:', error);

          this.applyMessage =
            error?.error?.message ||
            'Unable to apply for this tuition request.';

          this.cdr.detectChanges();
        }
      });
  }

  // --------------------------------
  // Applications
  // --------------------------------

  loadMyApplications(): void {
    this.tutorRequestService.getMyApplications().subscribe({
      next: (response: any) => {
        this.myApplications = Array.isArray(response)
          ? response
          : Array.isArray(response?.data)
            ? response.data
            : [];

        this.updateApplicationChart();

        this.acceptedCount = this.applicationChart.find(
          x => x.label === 'Accepted'
        )?.count || 0;

        this.cdr.detectChanges();
      },
      error: (error: any) => {
        console.error('MY APPLICATIONS ERROR:', error);

        this.myApplications = [];
        this.acceptedCount = 0;
        this.updateApplicationChart();

        this.errorMessage =
          error?.error?.message ||
          'Unable to load your applications.';

        this.cdr.detectChanges();
      }
    });
  }

  
updateApplicationChart(): void {
  const getStatus = (application: any): string => {
    return (
      application.applicationStatus ??
      ''
    ).toString().trim().toLowerCase();
  };

  this.applicationChart = [
    {
      label: 'Accepted',
      count: this.myApplications.filter(x =>
        getStatus(x) === 'accepted'
      ).length
    },
    {
      label: 'Pending',
      count: this.myApplications.filter(x =>
        getStatus(x) === 'pending'
      ).length
    },
    {
      label: 'Rejected',
      count: this.myApplications.filter(x =>
        getStatus(x) === 'rejected'
      ).length
    }
  ];
}


  // --------------------------------
  // Demo Requests
  // --------------------------------

  loadMyDemoRequests(): void {
    this.tutorRequestService.getMyDemoRequests().subscribe({
      next: (response: any) => {
        this.myDemoRequests = Array.isArray(response)
          ? response
          : Array.isArray(response?.data)
            ? response.data
            : [];

        this.myDemoRequests.forEach(demo => {
          const id = Number(demo.tutorDemoRequestId);

          if (!this.availabilityForms[id]) {
            this.availabilityForms[id] = {
              availableDate: '',
              startTime: '',
              endTime: '',
              tutorRemarks: ''
            };
          }
        });

        this.updateDemoChart();

        this.pendingDemoCount =
          this.demoChart.find(x => x.label === 'Pending')?.count || 0;

        this.cdr.detectChanges();
      },
      error: (error: any) => {
        console.error('MY DEMO REQUESTS ERROR:', error);

        this.myDemoRequests = [];
        this.pendingDemoCount = 0;
        this.updateDemoChart();

        this.cdr.detectChanges();
      }
    });
  }

  updateDemoChart(): void {
    const statuses = this.myDemoRequests.map(x =>
      (x.demoStatusName || '').toString().trim().toLowerCase()
    );

    this.demoChart = [
      {
        label: 'Pending',
        count: statuses.filter(x => x.includes('pending')).length
      },
      {
        label: 'Scheduled',
        count: statuses.filter(x =>
          x.includes('scheduled') || x.includes('confirmed')
        ).length
      },
      {
        label: 'Completed',
        count: statuses.filter(x => x.includes('completed')).length
      },
      {
        label: 'Other',
        count: statuses.filter(x =>
          x.includes('rejected') || x.includes('cancelled')
        ).length
      }
    ];
  }

  confirmDemo(demo: any): void {
    this.tutorRequestService
      .confirmDemo(demo.tutorDemoRequestId)
      .subscribe({
        next: () => {
          this.loadMyDemoRequests();
        },
        error: (error: any) => {
          console.error('CONFIRM DEMO ERROR:', error);

          this.errorMessage =
            error?.error?.message ||
            'Unable to confirm demo.';

          this.cdr.detectChanges();
        }
      });
  }

  // --------------------------------
  // Demo Availability
  // --------------------------------

  submitDemoAvailability(demo: any): void {
    const demoId = Number(demo.tutorDemoRequestId);
    const form = this.availabilityForms[demoId];

    this.availabilityMessages[demoId] = '';
    this.availabilityErrors[demoId] = '';

    if (!form?.availableDate || !form.startTime || !form.endTime) {
      this.availabilityErrors[demoId] =
        'Please select date, start time and end time.';
      return;
    }

    if (form.availableDate < this.availabilityMinDate) {
      this.availabilityErrors[demoId] =
        'Please select today or a future date.';
      return;
    }

    if (form.endTime <= form.startTime) {
      this.availabilityErrors[demoId] =
        'End time must be greater than start time.';
      return;
    }

    this.availabilityLoading[demoId] = true;

    const data = {
      tutorDemoRequestId: demoId,
      availableDate: form.availableDate,
      startTime: form.startTime,
      endTime: form.endTime,
      tutorRemarks: form.tutorRemarks
    };

    this.tutorRequestService.addDemoAvailability(data).subscribe({
      next: (response: any) => {
        this.availabilityMessages[demoId] =
          response?.message ||
          'Demo availability submitted successfully.';

        this.availabilityForms[demoId] = {
          availableDate: '',
          startTime: '',
          endTime: '',
          tutorRemarks: ''
        };

        this.availabilityLoading[demoId] = false;
        this.cdr.detectChanges();
      },
      error: (error: any) => {
        console.error('AVAILABILITY API ERROR:', error);

        this.availabilityErrors[demoId] =
          error?.error?.message ||
          error?.error?.title ||
          (typeof error?.error === 'string' ? error.error : null) ||
          error?.message ||
          'Unable to submit demo availability.';

        this.availabilityLoading[demoId] = false;
        this.cdr.detectChanges();
      }
    });
  }

  // --------------------------------
  // Active Tuitions and Payouts
  // --------------------------------

  loadMyActiveTuitions(): void {
    this.tutorRequestService.getMyActiveTuitions().subscribe({
      next: (response: any) => {
        this.myActiveTuitions = Array.isArray(response)
          ? response
          : Array.isArray(response?.data)
            ? response.data
            : [];

        this.activeTuitionCount = this.myActiveTuitions.length;

        this.updatePayoutSummary();
        this.cdr.detectChanges();
      },
      error: (error: any) => {
        console.error('ACTIVE TUITIONS ERROR:', error);

        this.myActiveTuitions = [];
        this.activeTuitionCount = 0;

        this.updatePayoutSummary();
        this.cdr.detectChanges();
      }
    });
  }

  updatePayoutSummary(): void {
    this.releasedPayout = 0;
    this.pendingPayout = 0;

    this.myActiveTuitions.forEach(tuition => {
      const amount = Number(tuition.tutorPayableAmount) || 0;

      if (
        tuition.tutorPaymentReleased === true ||
        tuition.tutorPaymentReleased === 1
      ) {
        this.releasedPayout += amount;
      } else {
        this.pendingPayout += amount;
      }
    });

    this.totalTutorEarnings =
      this.releasedPayout + this.pendingPayout;
  }

  // --------------------------------
  // Chart Helpers
  // --------------------------------

  getMaxChartValue(chart: ChartItem[]): number {
    return Math.max(...chart.map(x => x.count), 1);
  }

  // --------------------------------
  // Navigation
  // --------------------------------

  goToProfile(): void {
    this.router.navigate(['/tutor/profile']);
  }

  goToAvailableRequests(): void {
    this.router.navigate(['/tutor/available-requests']);
  }

  goToMyApplications(): void {
    this.router.navigate(['/tutor/my-applications']);
  }

  goToMyDemos(): void {
    this.router.navigate(['/tutor/my-demos']);
  }

  goToActiveTuitions(): void {
    this.router.navigate(['/tutor/active-tuitions']);
  }
}
