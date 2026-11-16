
import { ChangeDetectorRef,Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { timeout } from 'rxjs';
import {
  TutorRequestService,
  AdminTutorVerification
} from '../../Services/tutor-request.service';

@Component({
  selector: 'app-admin-tutor-verification',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-tutor-verification.html',
  styleUrl: './admin-tutor-verification.css'
})
export class AdminTutorVerificationComponent implements OnInit {

  tutors: AdminTutorVerification[] = [];
  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private tutorRequestService: TutorRequestService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadTutors();
  }

 


loadTutors(): void {
  this.loading = true;
  this.errorMessage = '';
  this.successMessage = '';

  this.tutorRequestService
    .getTutorsForAdminVerification()
    .subscribe({
      next: (data) => {
        this.tutors = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.errorMessage =
          error.error?.message ??
          error.message ??
          'Unable to load tutors. Please try again.';

        this.loading = false;
        this.cdr.detectChanges();
      }
    });
}




  updateVerification(
    tutor: AdminTutorVerification,
    status: 'Verified' | 'Rejected'
  ): void {
    const action = status === 'Verified' ? 'approve' : 'reject';

    if (!confirm(`Are you sure you want to ${action} ${tutor.tutorName}?`)) {
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.tutorRequestService
      .updateTutorVerification(tutor.tutorId, status)
      .subscribe({
        next: (response) => {
          this.successMessage = response.message;
          this.loadTutors();
        },
        error: (error) => {
          console.error('Tutor verification update failed:', error);

          this.errorMessage =
            error.error?.message ??
            'Unable to update tutor verification.';

          this.loading = false;
        }
      });
  }
}
