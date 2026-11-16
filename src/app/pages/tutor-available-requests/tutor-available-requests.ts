
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import {
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

  // Optional display fields returned by the API
  studentName?: string;
  subjectName?: string;
  tuitionTypeName?: string;
  cityName?: string;
  areaName?: string;
}

@Component({
  selector: 'app-tutor-available-requests',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tutor-available-requests.html',
  styleUrl: './tutor-available-requests.css'
})
export class TutorAvailableRequests implements OnInit {

  availableRequests: AvailableTuitionRequest[] = [];

  loading = false;
  errorMessage = '';
  applyMessage = '';
  applyingRequestId: number | null = null;

  constructor(
    private tutorRequestService: TutorRequestService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadAvailableRequests();
  }

  loadAvailableRequests(): void {
    this.loading = true;
    this.errorMessage = '';
    this.applyMessage = '';

    this.tutorRequestService.getAvailableTuitionRequests()
      .subscribe({
        next: (response) => {
          this.availableRequests = response || [];
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Available requests error:', error);

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
    if (this.applyingRequestId !== null) {
      return;
    }

    this.applyingRequestId = request.tuitionRequestId;
    this.applyMessage = '';
    this.errorMessage = '';

    this.tutorRequestService.applyForTuitionRequest(
      request.tuitionRequestId,
      'I am available for this tuition.'
    ).subscribe({
      next: (response) => {
        this.applyMessage =
          response?.message || 'Application submitted successfully.';

        this.availableRequests =
          this.availableRequests.filter(
            x => x.tuitionRequestId !== request.tuitionRequestId
          );

        this.applyingRequestId = null;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Apply request error:', error);

        this.errorMessage =
          error?.error?.message ||
          'Unable to apply for this tuition request.';

        this.applyingRequestId = null;
        this.cdr.detectChanges();
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/tutor/dashboard']);
  }
}
