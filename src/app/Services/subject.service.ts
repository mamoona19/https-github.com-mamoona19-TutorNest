import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Subject {
  subjectId: number;
  subjectName: string;
}

@Injectable({
  providedIn: 'root'
})
export class SubjectService {

  private apiUrl = 'https://localhost:44351/api/Subject';

  constructor(private http: HttpClient) {}

  getSubjects(): Observable<Subject[]> {
    return this.http.get<Subject[]>(this.apiUrl);
  }
}