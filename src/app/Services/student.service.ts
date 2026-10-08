import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Student {
  studentId: number;
  parentId: number;
  studentName: string;
  genderId: number;
  dateOfBirth: string | null;
  classId: number | null;
  boardId: number | null;
  schoolName: string | null;
  preferredTutorGenderId: number | null;
  tuitionTypeId: number | null;
  learningNotes: string | null;
  academicClassId: number | null;
}

export interface CreateStudent {
  studentName: string;
  genderId: number;
  dateOfBirth: string | null;
  classId: number | null;
  boardId: number | null;
  schoolName: string | null;
  preferredTutorGenderId: number | null;
  tuitionTypeId: number | null;
  learningNotes: string | null;
  academicClassId: number | null;
}

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  private apiUrl = 'https://localhost:44351/api/Student';

  constructor(private http: HttpClient) {}

  getMyStudents(): Observable<Student[]> {
    return this.http.get<Student[]>(
      `${this.apiUrl}/my-students`
    );
  }

  createStudent(student: CreateStudent): Observable<any> {
    return this.http.post<any>(
      this.apiUrl,
      student
    );
  }
}