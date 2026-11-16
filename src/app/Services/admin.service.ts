import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


export interface PendingDemoRequest {

  tutorDemoRequestId: number;
  tuitionRequestId: number;
  requestTutorId: number;

  parentId: number;
  tutorId: number;

  tutorFirstName: string;
  tutorLastName: string;

  studentId: number;
  studentName: string;

  subjectId: number;
  subjectName: string;

  tuitionTypeId: number;
  tuitionTypeName: string;

  cityId: number;
  cityName: string;

  areaId: number;
  areaName: string;

  budget: number;
  preferredStartDate: string | null;

  parentRemarks: string | null;
  requestedDate: string;

  demoStatusId: number;
  demoStatusName: string;
}
export interface TutorDemoAvailability {
  availabilityId: number;
  tutorDemoRequestId: number;
  tutorId: number;
  availableDate: string;
  startTime: string;
  endTime: string;
  tutorRemarks: string | null;
}
export interface PendingPayment {
  paymentId: number;
  invoiceId: number;
  invoiceNumber: string;

  tuitionRequestId: number;
  parentId: number;

  parentName: string;

  amount: number;

  paymentMethod: string;
  transactionReference: string | null;
  paymentDate: string | null;

  paymentStatusId: number;
  paymentStatusName: string;

  submittedDate: string;
}

@Injectable({
  providedIn: 'root'
})

export class AdminService {

  private apiUrl =
    'https://localhost:44351/api';

  constructor(
    private http: HttpClient
  ) {}


  getTutorApplications(): Observable<any[]> {

    return this.http.get<any[]>(
      `${this.apiUrl}/TutorRequest/admin-applications`
    );
  }


updateTutorApplication(
  requestTutorId: number,
  requestStatusName: string,
  adminRemarks: string
): Observable<any> {
  return this.http.put<any>(
    `${this.apiUrl}/TutorRequest/admin-applications/${requestTutorId}/status`,
    null,
    {
      params: {
        requestStatusName,
        adminRemarks
      }
    }
  );
}



  getPendingDemoRequests():
    Observable<PendingDemoRequest[]> {

    return this.http.get<PendingDemoRequest[]>(
      `${this.apiUrl}/TutorRequest/admin-pending-demos`
    );
  }
  getDemoAvailability(
  tutorDemoRequestId: number
): Observable<TutorDemoAvailability[]> {
  return this.http.get<TutorDemoAvailability[]>(
    `${this.apiUrl}/TutorRequest/admin-demo-availability/${tutorDemoRequestId}`
  );
}

scheduleTutorDemo(request: {
  tutorDemoRequestId: number;
  availabilityId: number;
  meetingModeId: number;
  meetingLink: string | null;
  meetingAddress: string | null;
  adminRemarks: string | null;
}): Observable<any> {
  return this.http.post<any>(
    `${this.apiUrl}/TutorRequest/admin-schedule-demo`,
    request
  );
}

selectTutor(requestTutorId: number) {
  return this.http.put(
    `${this.apiUrl}/TutorRequest/select-tutor/${requestTutorId}`,
    {}
  );
}

getPendingPayments(): Observable<any> {
  return this.http.get<any>(
    'https://localhost:44351/api/Payment/admin/pending-payments'
  );
}

getMeetingModes(): Observable<any[]> {
  return this.http.get<any[]>(
    `${this.apiUrl}/TutorRequest/meeting-modes`
  );
}
}