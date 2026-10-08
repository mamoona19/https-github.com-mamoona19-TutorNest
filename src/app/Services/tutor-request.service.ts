import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface TutorRequest {
  tutorRequestId: number;
  tuitionRequestId: number;
  tutorId: number;
  requestStatusId: number;
  sentDate: string;
  respondedDate: string | null;
  tutorRemarks: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class TutorRequestService {

  private apiUrl = 'https://localhost:44351/api/TutorRequest';

  constructor(private http: HttpClient) {}

  getTutorRequests(): Observable<TutorRequest[]> {
    return this.http.get<TutorRequest[]>(this.apiUrl);
  }

  getAvailableTuitionRequests(): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}/available`
    );
  }

 applyForTuitionRequest(
  tuitionRequestId: number,
  tutorRemarks: string
) {
  return this.http.post<any>(
    `${this.apiUrl}/apply`,
    null,
    {
      params: {
        tuitionRequestId: tuitionRequestId,
        tutorRemarks: tutorRemarks
      }
    }
  );
}
getMyApplications(): Observable<any[]> {
  return this.http.get<any[]>(
    `${this.apiUrl}/my-applications`
  );
}
getMyDemoRequests(): Observable<any[]> {
  return this.http.get<any[]>(
    `${this.apiUrl}/my-demo-requests`
  );
}
confirmDemo(
  tutorDemoRequestId: number
): Observable<any> {
  return this.http.put<any>(
    `${this.apiUrl}/tutor-confirm-demo/${tutorDemoRequestId}`,
    null
  );
}
completeDemo(
  tutorDemoRequestId: number
): Observable<any> {
  return this.http.put<any>(
    `${this.apiUrl}/complete-demo`,
    null,
    {
      params: {
        tutorDemoRequestId: tutorDemoRequestId
      }
    }
  );
}
}