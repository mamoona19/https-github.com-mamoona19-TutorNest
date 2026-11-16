
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  TuitionRequestService,
  MyTuitionRequest,
  TutorApplication
} from '../../Services/tuition-request.service';

import { ParentService } from '../../Services/parent.service';

@Component({
  selector: 'app-parent-my-requests',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './parent-my-requests.html',
  styleUrl: './parent-my-requests.css'
})
export class ParentMyRequests implements OnInit {

  // Parent
  parentId = 0;

  // Tuition Requests
  myRequests: MyTuitionRequest[] = [];
  isLoadingRequests = false;
  requestsError = '';

  showAllRequests = false;

  // Tutor Applications
  selectedRequestId: number | null = null;
  tutorApplications: TutorApplication[] = [];

  isLoadingApplications = false;
  applicationsError = '';

  // Demo Request
  demoMessage = '';
  demoMessageType: 'success' | 'error' = 'success';

  constructor(
    private tuitionRequestService: TuitionRequestService,
    private parentService: ParentService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadParentId();
  }

  // Get logged-in Parent ID
  loadParentId(): void {

    this.parentService.getMyParentId().subscribe({

      next: (response) => {

        this.parentId = Number(response.parentId);

        if (this.parentId) {
          this.loadMyTuitionRequests();
        } else {
          this.requestsError = 'Unable to identify logged-in parent.';
        }

        this.cdr.detectChanges();
      },

      error: (error) => {

        console.error('Parent ID Error:', error);

        this.requestsError =
          'Unable to identify logged-in parent.';

        this.cdr.detectChanges();
      }
    });
  }

  // Load Parent Tuition Requests
  loadMyTuitionRequests(): void {

    this.isLoadingRequests = true;
    this.requestsError = '';

    this.tuitionRequestService
      .getMyTuitionRequests()
      .subscribe({

        next: (requests) => {

          this.myRequests = requests || [];
          this.isLoadingRequests = false;

          this.cdr.detectChanges();
        },

        error: (error) => {

          console.error('My Tuition Requests Error:', error);

          this.myRequests = [];
          this.isLoadingRequests = false;

          this.requestsError =
            'Unable to load your tuition requests.';

          this.cdr.detectChanges();
        }
      });
  }

  // Load Tutor Applications
  loadTutorApplications(tuitionRequestId: number): void {

    // Toggle applications panel
    if (this.selectedRequestId === tuitionRequestId) {
      this.closeTutorApplications();
      return;
    }

    this.selectedRequestId = tuitionRequestId;

    this.isLoadingApplications = true;
    this.applicationsError = '';
    this.tutorApplications = [];

    this.demoMessage = '';

    this.tuitionRequestService
      .getTutorApplications(tuitionRequestId)
      .subscribe({

        next: (applications) => {

          this.tutorApplications = applications || [];
          this.isLoadingApplications = false;

          this.cdr.detectChanges();
        },

        error: (error) => {

          console.error('Tutor Applications Error:', error);

          this.tutorApplications = [];
          this.isLoadingApplications = false;

          this.applicationsError =
            'Unable to load tutor applications.';

          this.cdr.detectChanges();
        }
      });
  }

  // Request Demo
  requestDemo(application: TutorApplication): void {

    if (!this.parentId) {
      this.demoMessage = 'Unable to identify logged-in parent.';
      this.demoMessageType = 'error';
      return;
    }

    const request = {
      tuitionRequestId: application.tuitionRequestId,
      requestTutorId: application.requestTutorId,
      parentId: this.parentId,
      tutorId: application.tutorId,
      parentRemarks: 'I would like to arrange a demo.'
    };

    this.demoMessage = '';

    this.parentService.requestDemo(request).subscribe({

      next: (response: any) => {

        console.log('DEMO REQUESTED:', response);

        this.demoMessage =
          response?.message || 'Demo requested successfully.';

        this.demoMessageType = 'success';

        // Refresh applications from backend
        this.loadTutorApplications(application.tuitionRequestId);
      },

      error: (error: any) => {

        console.error('REQUEST DEMO ERROR:', error);

        this.demoMessage =
          error?.error?.message ||
          'Unable to request demo.';

        this.demoMessageType = 'error';

        this.cdr.detectChanges();
      }
    });
  }

  // Close Applications
  closeTutorApplications(): void {

    this.selectedRequestId = null;
    this.tutorApplications = [];

    this.isLoadingApplications = false;
    this.applicationsError = '';

    this.demoMessage = '';

    this.cdr.detectChanges();
  }
}
