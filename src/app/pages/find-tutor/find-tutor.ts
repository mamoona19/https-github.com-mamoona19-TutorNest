
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute,Router, RouterLink } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { SubjectService } from '../../Services/subject.service';
import { CityService } from '../../Services/city.service';
import { AreaService } from '../../Services/area.service';

import {
  TutorSearchService,
  VerifiedTutor
} from '../../Services/tutor-search.service';

interface SubjectOption {
  subjectId: number;
  subjectName: string;
}

interface CityOption {
  cityId: number;
  cityName: string;
}

interface AreaOption {
  areaId: number;
  areaName: string;
}

@Component({
  selector: 'app-find-tutor',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './find-tutor.html',
  styleUrl: './find-tutor.css'
})
export class FindTutor implements OnInit {
  subjects: SubjectOption[] = [];
  cities: CityOption[] = [];
  areas: AreaOption[] = [];
  tutors: VerifiedTutor[] = [];

  subjectId: number | null = null;
  cityId: number | null = null;
  areaId: number | null = null;
  maxBudget: number | null = null;

  loadingFilters = false;
  loading = false;
  searched = false;
  errorMessage = '';

  private requestedSubject = '';

constructor(
  private route: ActivatedRoute,
  private subjectService: SubjectService,
  private cityService: CityService,
  private areaService: AreaService,
  private tutorSearchService: TutorSearchService,
  private router: Router,
  private cdr: ChangeDetectorRef
) {}
  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      this.requestedSubject = params.get('subject') ?? '';
      this.applyRequestedSubject();
    });

    this.loadSubjects();
    this.loadCities();
  }

 private loadSubjects(): void {
  this.loadingFilters = true;

  this.subjectService.getSubjects().subscribe({
    next: (data) => {
      this.subjects = [...(data ?? [])];
      this.applyRequestedSubject();
      this.loadingFilters = false;

      this.cdr.detectChanges();
      console.log('Subjects loaded:', this.subjects.length);
    },
    error: (error) => {
      this.loadingFilters = false;
      this.errorMessage = 'Subjects could not be loaded. Please refresh the page.';

      console.error('Subjects API error:', error);
      this.cdr.detectChanges();
    }
  });
}

 private loadCities(): void {
  this.cityService.getCities().subscribe({
    next: (data) => {
      this.cities = [...(data ?? [])];

      this.cdr.detectChanges();
      console.log('Cities loaded:', this.cities.length);
    },
    error: (error) => {
      this.errorMessage = 'Cities could not be loaded. Please refresh the page.';

      console.error('Cities API error:', error);
      this.cdr.detectChanges();
    }
  });
}

  private applyRequestedSubject(): void {
    if (!this.requestedSubject || !this.subjects.length) {
      return;
    }

    const match = this.subjects.find(
      item =>
        item.subjectName.toLowerCase() ===
        this.requestedSubject.trim().toLowerCase()
    );

    if (match) {
      this.subjectId = match.subjectId;
    }
  }

  onCityChange(): void {
    this.areaId = null;
    this.areas = [];

    if (this.cityId == null) {
      return;
    }

    this.areaService.getAreasByCity(this.cityId).subscribe({
      next: (data) => {
        this.areas = data ?? [];
      },
      error: () => {
        this.errorMessage =
          'Areas could not be loaded for the selected city.';
      }
    });
  }

 


searchTutors(): void {
  this.errorMessage = '';
  this.loading = true;
  this.searched = true;
  this.tutors = [];

  this.cdr.detectChanges();

  const filters = {
    ...(this.subjectId != null ? { subjectId: this.subjectId } : {}),
    ...(this.cityId != null ? { cityId: this.cityId } : {}),
    ...(this.areaId != null ? { areaId: this.areaId } : {}),
    ...(this.maxBudget != null ? { maxHourlyRate: this.maxBudget } : {})
  };

  this.tutorSearchService.searchTutors(filters).subscribe({
    next: (data) => {
      this.tutors = [...(data ?? [])];
      this.loading = false;

      this.cdr.detectChanges();

      console.log('Tutors loaded:', this.tutors.length);
    },
    error: (error) => {
      this.loading = false;
      this.errorMessage =
        error?.error?.message ??
        'Tutors could not be loaded. Please try again.';

      this.cdr.detectChanges();

      console.error('Tutor search error:', error);
    }
  });
}

viewTutorProfile(tutor: VerifiedTutor): void {
  this.router.navigate(['/tutor-profile', tutor.tutorId]);
}

requestThisTutor(tutor: VerifiedTutor): void {
  console.log('Request tutor:', tutor.tutorId);
}


  clearFilters(): void {
    this.subjectId = null;
    this.cityId = null;
    this.areaId = null;
    this.maxBudget = null;

    this.areas = [];
    this.tutors = [];
    this.searched = false;
    this.errorMessage = '';
  }
  onSubjectClick(): void {
  console.log('Subject dropdown clicked', this.subjects.length);
}

}
