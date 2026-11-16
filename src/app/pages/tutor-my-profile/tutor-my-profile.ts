
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import {
  TutorProfileService,
  TutorProfile,
  TutorProfileLookups,
  UpdateTutorProfile
} from '../../Services/tutor-profile.service';

interface TutorTuitionTypesResponse {
  tuitionTypeIds: number[];
  message?: string;
}

@Component({
  selector: 'app-tutor-my-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tutor-my-profile.html',
  styleUrl: './tutor-my-profile.css'
})
export class TutorMyProfile implements OnInit {

  // Lookup data
  lookups: TutorProfileLookups = {
    tuitionTypes: [],
    subjects: [],
    cities: [],
    areas: [],
    degrees: [],
    genders: []
  };

  // Saved profile information
  tutorProfile: TutorProfile | null = null;

  
  // Editable profile fields
  profileForm: UpdateTutorProfile = {
  genderId: null,
  cityId: 0,
  areaId: 0,
  highestDegreeId: 0,
  experienceYears: 0,
  hourlyRate: null,
  bio: '',
  isDemoAvailable: false,
  workingHours: 'Flexible'
};

  // Tuition preferences
  selectedTuitionTypes: number[] = [];

  // Loading states
  loading = true;
  profileLoading = true;
  saving = false;
  profileSaving = false;

  successMessage = '';
  errorMessage = '';

  profileSuccessMessage = '';
  profileErrorMessage = '';

  constructor(
    private tutorProfileService: TutorProfileService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadProfileLookups();
    this.loadProfile();
    this.loadTuitionTypes();
  }

  // Load all dropdown data
  loadProfileLookups(): void {
    this.tutorProfileService.getProfileLookups().subscribe({
      next: (response) => {
        this.lookups = response;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('PROFILE LOOKUPS ERROR:', error);
        this.profileErrorMessage =
          error.error?.message || 'Unable to load profile dropdowns.';
        this.cdr.detectChanges();
      }
    });
  }

  // Load saved tutor profile
  loadProfile(): void {
    this.profileLoading = true;
    this.profileErrorMessage = '';
    

    this.tutorProfileService.getProfile().subscribe({
      next: (response: TutorProfile) => {
        this.tutorProfile = response;

        this.profileForm = {
          genderId: response.genderId,
          cityId: response.cityId,
          areaId: response.areaId,
          highestDegreeId: response.highestDegreeId,
          experienceYears: response.experienceYears,
          hourlyRate: response.hourlyRate,
          bio: response.bio,
          isDemoAvailable: response.isDemoAvailable,
          
workingHours: 'Flexible'
        };

        this.profileLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('LOAD PROFILE ERROR:', error);

        this.profileErrorMessage =
          error.error?.message || 'Unable to load your profile.';

        this.profileLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  // Areas belonging to selected city
  get filteredAreas() {
    return this.lookups.areas.filter(
      area => area.cityId === this.profileForm.cityId
    );
  }

  // Reset area when city changes
  onCityChange(): void {
    this.profileForm.areaId = 0;
  }

  // Update profile
  saveProfile(): void {
    this.profileSuccessMessage = '';
    this.profileErrorMessage = '';

    if (
      !this.profileForm.cityId ||
      !this.profileForm.areaId ||
      !this.profileForm.highestDegreeId
    ) {
      this.profileErrorMessage =
        'Please select your city, area and highest degree.';
      return;
    }

    this.profileSaving = true;

    this.tutorProfileService.updateProfile(this.profileForm).subscribe({
      next: (response) => {
        this.profileSuccessMessage =
          response?.message || 'Profile updated successfully.';

        this.profileSaving = false;
        this.loadProfile();
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('UPDATE PROFILE ERROR:', error);

        this.profileErrorMessage =
          error.error?.message || 'Unable to update your profile.';

        this.profileSaving = false;
        this.cdr.detectChanges();
      }
    });
  }

  // Load saved tuition preferences
  loadTuitionTypes(): void {
    this.loading = true;
    this.errorMessage = '';

    this.tutorProfileService.getTuitionTypes().subscribe({
      next: (response: TutorTuitionTypesResponse) => {
        this.selectedTuitionTypes = response.tuitionTypeIds || [];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('LOAD TUITION TYPES ERROR:', error);

        this.errorMessage =
          error.error?.message || 'Unable to load tuition preferences.';

        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  // Select or unselect tuition type
  toggleTuitionType(id: number, checked: boolean): void {
    if (checked) {
      if (!this.selectedTuitionTypes.includes(id)) {
        this.selectedTuitionTypes.push(id);
      }
    } else {
      this.selectedTuitionTypes =
        this.selectedTuitionTypes.filter(x => x !== id);
    }
  }

  // Save tuition preferences
  saveTuitionTypes(): void {
    this.successMessage = '';
    this.errorMessage = '';

    if (this.selectedTuitionTypes.length === 0) {
      this.errorMessage = 'Please select at least one tuition type.';
      return;
    }

    this.saving = true;

    this.tutorProfileService
      .saveTuitionTypes(this.selectedTuitionTypes)
      .subscribe({
        next: (response: TutorTuitionTypesResponse) => {
          this.selectedTuitionTypes = response.tuitionTypeIds || [];

          this.successMessage =
            response.message || 'Preferences saved successfully.';

          this.saving = false;
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('SAVE TUITION TYPES ERROR:', error);

          this.errorMessage =
            error.error?.message || 'Unable to save tuition preferences.';

          this.saving = false;
          this.cdr.detectChanges();
        }
      });
  }

  goBack(): void {
    this.router.navigate(['/tutor/dashboard']);
  }
}
