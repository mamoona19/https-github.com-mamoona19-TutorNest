import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface RegisterUser {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  roleId: number;
}

export interface RegisterUserResponse {
  userId: number;
  roleId: number;
  message: string;
}

export interface LoginUser {
  email: string;
  password: string;
}

export interface LoginUserResponse {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  roleId: number;
  token: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'https://localhost:44351/api/Auth';

  constructor(private http: HttpClient) {}

  register(data: RegisterUser): Observable<RegisterUserResponse> {
    return this.http.post<RegisterUserResponse>(
      `${this.apiUrl}/register`,
      data
    );
  }

  login(data: LoginUser): Observable<LoginUserResponse> {
    return this.http.post<LoginUserResponse>(
      `${this.apiUrl}/login`,
      data
    );
  }
  
}