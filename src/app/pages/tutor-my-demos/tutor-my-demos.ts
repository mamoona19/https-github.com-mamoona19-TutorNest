
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TutorRequestService } from '../../Services/tutor-request.service';

@Component({
  selector: 'app-tutor-my-demos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tutor-my-demos.html',
  styleUrl: './tutor-my-demos.css'
})
export class TutorMyDemos implements OnInit {

  availabilityMinDate = new Date().toISOString().split('T')[0];

  myDemoRequests: any[] = [];

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

  loading = true;
  errorMessage = '';

  constructor(
    private tutorRequestService: TutorRequestService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadMyDemoRequests();
  }

  loadMyDemoRequests(): void {

    this.loading = true;
    this.errorMessage = '';

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

        this.loading = false;
        this.cdr.detectChanges();
      },

      error: (error: any) => {

        console.error('MY DEMO REQUESTS ERROR:', error);

        this.myDemoRequests = [];
        this.loading = false;

        this.errorMessage =
          error?.error?.message ||
          'Unable to load your demo requests.';

        this.cdr.detectChanges();
      }
    });
  }

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
          response.message ||
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
          'Unable to submit demo availability.';

        this.availabilityLoading[demoId] = false;
        this.cdr.detectChanges();
      }
    });
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

  getStatusClass(status: string): string {
    const value = (status || '').toLowerCase();

    if (value === 'completed' || value === 'parent confirmed') {
      return 'completed';
    }

    if (value === 'tutor confirmed' || value === 'scheduled') {
      return 'scheduled';
    }

    if (value === 'rejected' || value === 'cancelled') {
      return 'rejected';
    }

    return 'pending';
  }
}
