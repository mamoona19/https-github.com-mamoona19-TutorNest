import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CreateTuitionRequest {
  parentId: number;
  studentId: number;
  tuitionTypeId: number;
  subjectId: number;
  cityId: number;
  areaId: number;
  budget: number;
  preferredTutorGenderId: number;
  preferredStartDate: string;
  specialInstructions: string;
  createdBy: number;
}
export interface TutorDemoRequest {
  tuitionRequestId: number;
  requestTutorId: number;
  parentId: number;
  tutorId: number;
  parentRemarks?: string;
}


export interface MyTuitionRequest {
  tuitionRequestId: number;
  parentId: number;

  studentId: number;
  studentName: string;

  tuitionTypeId: number;
  tuitionTypeName: string;

  subjectId: number;
  subjectName: string;

  cityId: number;
  cityName: string;

  areaId: number;
  areaName: string;

  budget: number;

  preferredTutorGenderId: number | null;

  preferredStartDate: string | null;

  specialInstructions: string | null;

  statusId: number;
  statusName: string;

  createdDate: string;
}
export interface TutorApplication {
  requestTutorId: number;
  tuitionRequestId: number;
  tutorId: number;
  userId: number;

  firstName: string;
  lastName: string;

  requestStatusId: number;
  requestStatusName: string;

  tutorRemarks: string | null;
  isSelected: boolean;

  createdDate: string;

  sentDate?: string;
  responseDate?: string | null;

  selectedForDemo?: boolean;

  // ADD THESE
  demoRequested?: boolean;
  demoStatusId?: number;
  demoStatusName?: string;
}
@Injectable({
  providedIn: 'root'
})
export class TuitionRequestService {

  private apiUrl = 'https://localhost:44351/api/TuitionRequest';

  constructor(private http: HttpClient) {}

  // Create Tuition Request
  createTuitionRequest(
    request: CreateTuitionRequest
  ): Observable<any> {
    return this.http.post<any>(
      this.apiUrl,
      request
    );
  }

  // Old Parent Tuition Requests
  getParentTuitionRequests(
    parentId: number
  ): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}/parent/${parentId}`
    );
  }

  // Get Logged-in Parent's Tuition Requests
  getMyTuitionRequests(): Observable<MyTuitionRequest[]> {
    return this.http.get<MyTuitionRequest[]>(
      `${this.apiUrl}/my-requests`
    );
  }
  getTutorApplications(
  tuitionRequestId: number
): Observable<TutorApplication[]> {
  return this.http.get<TutorApplication[]>(
    `${this.apiUrl}/${tuitionRequestId}/tutor-applications`
  );
}
requestTutorDemo(request: any): Observable<any> {
  return this.http.post(
    `https://localhost:44351/api/TutorRequest/request-demo`,
    request
  );
}
}