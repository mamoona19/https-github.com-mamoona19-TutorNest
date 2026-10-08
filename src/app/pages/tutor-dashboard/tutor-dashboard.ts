import { Component, OnInit,ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';

import {
  TutorRequest,
  TutorRequestService
} from '../../Services/tutor-request.service';
import { CommonModule } from '@angular/common';

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

@Component({
  selector: 'app-tutor-dashboard',
  imports: [CommonModule],
  templateUrl: './tutor-dashboard.html',
  styleUrl: './tutor-dashboard.css'
})
export class TutorDashboard implements OnInit {

  firstName = '';
  lastName = '';
myApplications: any[] = [];
  tutorRequests: TutorRequest[] = [];
  availableRequests: AvailableTuitionRequest[] = [];
acceptedCount = 0;
pendingDemoCount = 0;
activeTuitionCount = 0;
  loading = true;
  errorMessage = '';
  applyMessage = '';
  myDemoRequests: any[] = [];
  

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
}

 loadAvailableRequests(): void {
  this.loading = true;
  this.errorMessage = '';

  console.log('START loading available requests');

  this.tutorRequestService.getAvailableTuitionRequests().subscribe({
  next: (response) => {

  console.log('AVAILABLE RESPONSE:', response);

  this.availableRequests = response;
  this.loading = false;

  console.log('LOADING FALSE');
  console.log('COUNT:', this.availableRequests.length);

  this.cdr.detectChanges();
},

    error: (error) => {

      console.error('AVAILABLE REQUEST ERROR:', error);

      this.loading = false;

      this.errorMessage =
        error.error?.message ||
        'Unable to load available tuition requests.';
    }
  });
}

 applyForRequest(request: AvailableTuitionRequest): void {

  const tutorRemarks = 'I am available for this tuition.';

  this.tutorRequestService
    .applyForTuitionRequest(
      request.tuitionRequestId,
      tutorRemarks
    )
    .subscribe({
     next: (response) => {

  this.applyMessage = 'Applied successfully.';

  this.availableRequests =
    this.availableRequests.filter(
      x => x.tuitionRequestId !== request.tuitionRequestId
    );
},

      error: (error) => {
        console.error('Apply error:', error);

        this.applyMessage =
          error.error?.message ||
          'Unable to apply for this tuition request.';
      }
    });
}

  goToProfile(): void {
    this.router.navigate(['/tutor/profile']);
  }
  loadMyApplications(): void {

  console.log('LOADING MY APPLICATIONS...');

  this.tutorRequestService
    .getMyApplications()
    .subscribe({
      next: (response) => {

        console.log('MY APPLICATIONS RESPONSE:', response);
        console.log('APPLICATION COUNT:', response.length);

        this.myApplications = response;
this.acceptedCount =
  this.myApplications.filter(
    x => x.requestStatusId === 2
  ).length;

this.pendingDemoCount =
  this.myApplications.filter(
    x => x.tuitionRequestStatusId === 4
  ).length;

this.activeTuitionCount =
  this.myApplications.filter(
    x => x.tuitionRequestStatusId === 6
  ).length;
        console.log(
          'MY APPLICATIONS AFTER ASSIGNMENT:',
          this.myApplications
        );
      },

      error: (error) => {

        console.error(
          'MY APPLICATIONS ERROR:',
          error
        );

        this.myApplications = [];
      }
    });
}
loadMyDemoRequests(): void {

  console.log('LOADING MY DEMO REQUESTS...');

  this.tutorRequestService
    .getMyDemoRequests()
    .subscribe({
      next: (response) => {

        console.log(
          'MY DEMO REQUESTS RESPONSE:',
          response
        );

        console.log(
          'DEMO COUNT:',
          response.length
        );

        this.myDemoRequests = response;

        // Dynamic status check using status name
        this.pendingDemoCount =
          this.myDemoRequests.filter(
            x =>
              x.demoStatusName &&
              x.demoStatusName.toLowerCase().includes('scheduled')
          ).length;

        console.log(
          'PENDING DEMO COUNT:',
          this.pendingDemoCount
        );

        this.cdr.detectChanges();
      },

      error: (error) => {

        console.error(
          'MY DEMO REQUESTS ERROR:',
          error
        );

        this.myDemoRequests = [];
        this.pendingDemoCount = 0;
      }
    });
}


confirmDemo(demo: any): void {

  this.tutorRequestService
    .confirmDemo(demo.tutorDemoRequestId)
    .subscribe({
      next: (response) => {

        console.log(
          'DEMO CONFIRMED:',
          response
        );

        // Do not manually set demoStatusId or demoStatusName.
        // Reload actual status from database/API.
        this.loadMyDemoRequests();
      },

      error: (error) => {

        console.error(
          'CONFIRM DEMO ERROR:',
          error
        );

        this.errorMessage =
          error?.error?.message ||
          'Unable to confirm demo.';
      }
    });
}
completeDemo(demo: any): void {

  this.tutorRequestService
    .completeDemo(demo.tutorDemoRequestId)
    .subscribe({
      next: (response) => {

        console.log(
          'DEMO COMPLETED:',
          response
        );

        // Reload actual status from database/API
        this.loadMyDemoRequests();
      },

      error: (error) => {

        console.error(
          'COMPLETE DEMO ERROR:',
          error
        );

        this.errorMessage =
          error?.error?.message ||
          'Unable to complete demo.';
      }
    });
}
}