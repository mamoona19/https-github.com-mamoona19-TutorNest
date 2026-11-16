
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface PublicTutor {
  tutorId: number;
  fullName: string;
  profilePhoto: string | null;
  cityId: number;
  cityName: string | null;
  areaId: number;
  areaName: string | null;
  highestDegreeId: number;
  degreeName: string | null;
  experienceYears: number;
  hourlyRate: number;
  bio: string | null;
  isDemoAvailable: boolean;
  averageRating: number;
  totalReviews: number;
  subjectNames: string | null;
  tuitionTypeNames: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class PublicTutorService {

  private apiUrl = 'https://localhost:44351/api/public-tutors';

  constructor(private http: HttpClient) {}

  getPublicTutors(): Observable<PublicTutor[]> {
    return this.http.get<PublicTutor[]>(this.apiUrl);
  }
}
