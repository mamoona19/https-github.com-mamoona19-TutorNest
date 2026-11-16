
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface VerifiedTutor {
  tutorId: number;
  tutorName: string;
  bio: string | null;
  profilePhoto: string | null;
  experienceYears: number;
  hourlyRate: number | null;
  isDemoAvailable: boolean;
  averageRating: number;
  totalReviews: number;
  cityId: number | null;
  cityName: string | null;
  areaId: number | null;
  areaName: string | null;
  highestDegree: string | null;
  subjectId: number;
  subjectName: string;
}

export interface TutorSearchFilters {
  subjectId?: number;
  cityId?: number;
  areaId?: number;
  tuitionTypeId?: number;
  maxHourlyRate?: number;
}

@Injectable({
  providedIn: 'root'
})
export class TutorSearchService {
  private readonly apiUrl =
    'https://localhost:44351/api/TutorSearch/search';

  constructor(private http: HttpClient) {}

  searchTutors(
    filters: TutorSearchFilters
  ): Observable<VerifiedTutor[]> {
    let params = new HttpParams();

    if (filters.subjectId != null) {
      params = params.set('subjectId', filters.subjectId);
    }

    if (filters.cityId != null) {
      params = params.set('cityId', filters.cityId);
    }

    if (filters.areaId != null) {
      params = params.set('areaId', filters.areaId);
    }

    if (filters.tuitionTypeId != null) {
      params = params.set('tuitionTypeId', filters.tuitionTypeId);
    }

    if (filters.maxHourlyRate != null) {
      params = params.set('maxHourlyRate', filters.maxHourlyRate);
    }

    return this.http.get<VerifiedTutor[]>(this.apiUrl, { params });
  }
}
