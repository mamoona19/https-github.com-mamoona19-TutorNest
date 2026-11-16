
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Dropdown interfaces
export interface TutorTuitionType {
  tuitionTypeId: number;
  tuitionTypeName: string;
}

export interface TutorSubject {
  subjectId: number;
  subjectName: string;
}

export interface TutorCity {
  cityId: number;
  cityName: string;
}

export interface TutorArea {
  areaId: number;
  cityId: number;
  areaName: string;
}

export interface TutorDegree {
  degreeId: number;
  degreeName: string;
}

export interface TutorGender {
  genderId: number;
  genderName: string;
}

// All profile dropdown data
export interface TutorProfileLookups {
  tuitionTypes: TutorTuitionType[];
  subjects: TutorSubject[];
  cities: TutorCity[];
  areas: TutorArea[];
  degrees: TutorDegree[];
  genders: TutorGender[];
}

// Saved tutor profile
export interface TutorProfile {
  tutorId: number;
  fullName: string;
  cnic: string;

  genderId: number | null;
  genderName: string | null;

  cityId: number;
  cityName: string | null;

  areaId: number;
  areaName: string | null;

  highestDegreeId: number;
  degreeName: string | null;

  experienceYears: number;
  hourlyRate: number | null;
  bio: string | null;

  isDemoAvailable: boolean;

  verificationStatusId: number;
  averageRating: number;
  totalReviews: number;
}

// Profile update request
export interface UpdateTutorProfile {
  genderId: number | null;
  cityId: number;
  areaId: number;
  highestDegreeId: number;
  experienceYears: number;
  hourlyRate: number | null;
  bio: string | null;
  isDemoAvailable: boolean;
  workingHours: string;
}

@Injectable({
  providedIn: 'root'
})
export class TutorProfileService {

  private apiUrl = 'https://localhost:44351/api/Tutor';

  constructor(private http: HttpClient) {}

  // Get saved tuition preferences
  getTuitionTypes(): Observable<{ tuitionTypeIds: number[] }> {
    return this.http.get<{ tuitionTypeIds: number[] }>(
      `${this.apiUrl}/tuition-types`
    );
  }

  // Save selected tuition preferences
  saveTuitionTypes(tuitionTypeIds: number[]): Observable<{
    message: string;
    tuitionTypeIds: number[];
  }> {
    return this.http.put<{
      message: string;
      tuitionTypeIds: number[];
    }>(
      `${this.apiUrl}/tuition-types`,
      { tuitionTypeIds }
    );
  }

  // Get profile dropdown lookup data
  getProfileLookups(): Observable<TutorProfileLookups> {
    return this.http.get<TutorProfileLookups>(
      `${this.apiUrl}/profile-lookups`
    );
  }

  // Get logged-in tutor profile
  getProfile(): Observable<TutorProfile> {
    return this.http.get<TutorProfile>(
      `${this.apiUrl}/profile`
    );
  }

  // Update logged-in tutor profile
  updateProfile(
    profile: UpdateTutorProfile
  ): Observable<any> {
    return this.http.put<any>(
      `${this.apiUrl}/profile`,
      profile
    );
  }
}
