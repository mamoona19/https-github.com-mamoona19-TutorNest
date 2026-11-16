
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TutorRequestService } from '../../Services/tutor-request.service';

@Component({
  selector: 'app-tutor-my-applications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tutor-my-applications.html',
  styleUrl: './tutor-my-applications.css'
})
export class TutorMyApplications implements OnInit {

  myApplications: any[] = [];
  loading = true;
  errorMessage = '';

  constructor(
    private tutorRequestService: TutorRequestService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadMyApplications();
  }

  loadMyApplications(): void {

    this.loading = true;
    this.errorMessage = '';

    this.tutorRequestService.getMyApplications().subscribe({

      next: (response: any) => {

        if (Array.isArray(response)) {
          this.myApplications = response;
        } else if (Array.isArray(response?.data)) {
          this.myApplications = response.data;
        } else {
          this.myApplications = [];
        }

        this.loading = false;
        this.cdr.detectChanges();
      },

      error: (error: any) => {

        console.error('MY APPLICATIONS ERROR:', error);

        this.myApplications = [];
        this.loading = false;

        this.errorMessage =
          error?.error?.message ||
          'Unable to load your applications.';

        this.cdr.detectChanges();
      }

    });
  }
}
