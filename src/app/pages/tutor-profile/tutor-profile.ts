
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  TutorSearchService,
  VerifiedTutor
} from '../../Services/tutor-search.service';
import {
  PublicTutorService,
  PublicTutor
} from '../../Services/public-tutor.service';

interface TutorProfileView {
  tutorId: number;
  tutorName: string;
  profilePhoto: string | null;
  highestDegree: string | null;
  subjectName: string | null;
  areaName: string | null;
  cityName: string | null;
  experienceYears: number;
  hourlyRate: number | null;
  isDemoAvailable: boolean;
  averageRating: number;
  totalReviews: number;
  bio: string | null;
}

@Component({
  selector: 'app-tutor-profile',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './tutor-profile.html',
  styleUrl: './tutor-profile.css'
})
export class TutorProfile implements OnInit {
  tutor: TutorProfileView | null = null;
  loading = true;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tutorSearchService: TutorSearchService,
    private publicTutorService: PublicTutorService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!Number.isInteger(id) || id <= 0) {
      this.errorMessage = 'Invalid tutor profile.';
      this.loading = false;
      return;
    }

    this.tutorSearchService.searchTutors({}).subscribe({
      next: (tutors) => {
        const existingTutor = (tutors ?? []).find(
          t => t.tutorId === id
        );

        if (existingTutor) {
          this.tutor = this.mapSearchTutor(existingTutor);
          this.finishLoading();
        } else {
          this.loadPublicTutor(id);
        }
      },
      error: (error) => {
        console.error('Tutor search failed:', error);
        this.loadPublicTutor(id);
      }
    });
  }

  private loadPublicTutor(id: number): void {
    this.publicTutorService.getPublicTutors().subscribe({
      next: (tutors) => {
        const publicTutor = (tutors ?? []).find(
          t => t.tutorId === id
        );

        if (publicTutor) {
          this.tutor = this.mapPublicTutor(publicTutor);
        } else {
          this.errorMessage =
            'Tutor profile could not be found. Please return to Find Tutors and search again.';
        }

        this.finishLoading();
      },
      error: (error) => {
        console.error('Public tutor loading failed:', error);
        this.errorMessage =
          'Tutor profile could not be loaded. Please try again.';
        this.finishLoading();
      }
    });
  }

  private mapSearchTutor(t: VerifiedTutor): TutorProfileView {
    return {
      tutorId: t.tutorId,
      tutorName: t.tutorName,
      profilePhoto: t.profilePhoto,
      highestDegree: t.highestDegree,
      subjectName: t.subjectName,
      areaName: t.areaName,
      cityName: t.cityName,
      experienceYears: t.experienceYears,
      hourlyRate: t.hourlyRate,
      isDemoAvailable: t.isDemoAvailable,
      averageRating: t.averageRating,
      totalReviews: t.totalReviews,
      bio: t.bio
    };
  }

  private mapPublicTutor(t: PublicTutor): TutorProfileView {
    return {
      tutorId: t.tutorId,
      tutorName: t.fullName,
      profilePhoto: t.profilePhoto,
      highestDegree: t.degreeName,
      subjectName: t.subjectNames,
      areaName: t.areaName,
      cityName: t.cityName,
      experienceYears: t.experienceYears,
      hourlyRate: t.hourlyRate,
      isDemoAvailable: t.isDemoAvailable,
      averageRating: t.averageRating,
      totalReviews: t.totalReviews,
      bio: t.bio
    };
  }

  private finishLoading(): void {
    this.loading = false;
    this.cdr.detectChanges();
  }

  requestThisTutor(): void {
    if (!this.tutor) {
      return;
    }

    this.router.navigate(['/request-tutor'], {
      queryParams: { tutorId: this.tutor.tutorId }
    });
  }
}
