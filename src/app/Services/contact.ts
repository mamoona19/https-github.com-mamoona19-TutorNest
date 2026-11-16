
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ContactInquiry {
  fullName: string;
  email: string;
  roleName: string;
  subject: string;
  message: string;
}

export interface ContactInquiryResponse {
  success: boolean;
  message: string;
  data: {
    contactInquiryId: number;
    inquiryStatus: string;
    createdDate: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl =
    'https://localhost:44351/api/contact-inquiries';

  submitInquiry(
    inquiry: ContactInquiry
  ): Observable<ContactInquiryResponse> {
    return this.http.post<ContactInquiryResponse>(
      this.apiUrl,
      inquiry
    );
  }
}
