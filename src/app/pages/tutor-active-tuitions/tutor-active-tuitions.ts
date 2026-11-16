import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TutorRequestService } from '../../Services/tutor-request.service';

@Component({
  selector: 'app-tutor-active-tuitions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tutor-active-tuitions.html',
  styleUrl: './tutor-active-tuitions.css'
})
export class TutorActiveTuitions implements OnInit {

  myActiveTuitions: any[] = [];
  loading = true;
  errorMessage = '';

  constructor(
    private tutorRequestService: TutorRequestService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadMyActiveTuitions();
  }

  loadMyActiveTuitions(): void {
    this.loading = true;
    this.errorMessage = '';

    this.tutorRequestService.getMyActiveTuitions().subscribe({
      next: (response: any) => {
        this.myActiveTuitions = Array.isArray(response)
          ? response
          : Array.isArray(response?.data)
            ? response.data
            : [];

        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error: any) => {
        console.error('ACTIVE TUITIONS ERROR:', error);

        this.myActiveTuitions = [];
        this.loading = false;
        this.errorMessage =
          error?.error?.message ||
          'Unable to load your active tuitions.';

        this.cdr.detectChanges();
      }
    });
  }
}