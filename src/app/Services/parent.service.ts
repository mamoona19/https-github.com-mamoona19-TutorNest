import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ParentIdResponse {
  parentId: number;
}
export interface Invoice {
  invoiceId: number;
  tuitionContractId: number;
  tuitionRequestId: number;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  invoiceAmount: number;
  discountAmount: number;
  taxAmount: number;
  netAmount: number;
  invoiceStatusId: number;
  invoiceStatusName: string;
  monthlyFee: number;
  paymentTermsName: string;
  tutorName: string;
  studentName: string;
}
export interface CreatePaymentRequest {
  invoiceId: number;
  paymentMethodId: number;
  paymentGatewayId: number;
  transactionReference?: string;
}
export interface InvoiceResponse {
  success: boolean;
  data: Invoice[];
}

export interface ParentStudent {
  studentId: number;
  studentName: string;
  genderId: number;
  genderName: string;
  dateOfBirth: string | null;
  classId: number;
  className: string;
  boardId: number;
  boardName: string;
  schoolName: string | null;
  tuitionTypeId: number;
  tuitionTypeName: string;
  preferredTutorGenderId: number | null;
  preferredTutorGenderName: string | null;
  learningNotes: string | null;
}

export interface ParentProfile {
  parentId: number;
  firstName: string;
  lastName: string | null;
  email: string;
  phoneNumber: string;
  address: string;
  cityId: number;
  cityName: string;
  areaId: number;
  areaName: string;
  genderId: number | null;
  genderName: string | null;
  occupation: string;
  preferredContactMethod: string;
  children: ParentStudent[];
}

export interface ParentProfileResponse {
  success: boolean;
  data: ParentProfile;
}


@Injectable({
  providedIn: 'root'
})
export class ParentService {

  private apiUrl = 'https://localhost:44351/api/Parent';

  constructor(private http: HttpClient) {}

  getMyParentId(): Observable<ParentIdResponse> {
    return this.http.get<ParentIdResponse>(
      `${this.apiUrl}/my-parent-id`
    );
  }
  getMyDemoRequests(): Observable<any[]> {
  return this.http.get<any[]>(
    `${this.apiUrl}/my-demo-requests`
  );
}
requestDemo(request: {
    tuitionRequestId: number;
    requestTutorId: number;
    parentId: number;
    tutorId: number;
    parentRemarks?: string;
  }): Observable<any> {
    return this.http.post<any>(
      'https://localhost:44351/api/TutorRequest/request-demo',
      request
    );
  }
 getMyInvoices(): Observable<InvoiceResponse> {
  return this.http.get<InvoiceResponse>(
    'https://localhost:44351/api/Payment/parent/invoices'
  );
}
createPayment(request: CreatePaymentRequest): Observable<any> {

    return this.http.post<any>(
      `${this.apiUrl}/Payment/parent/pay`,
      request
    );
  }
  confirmParentDemo(tutorDemoRequestId: number): Observable<any> {
  return this.http.put<any>(
    `https://localhost:44351/api/Parent/parent-confirm-demo/${tutorDemoRequestId}`,
    null
  );
}
getMyProfile(): Observable<ParentProfileResponse> {
  return this.http.get<ParentProfileResponse>(
    `${this.apiUrl}/my-profile`
  );
}
}