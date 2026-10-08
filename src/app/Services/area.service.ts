import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Area {
  areaId: number;
  areaName: string;
}

@Injectable({
  providedIn: 'root'
})
export class AreaService {

  private apiUrl = 'https://localhost:44351/api/Area';

  constructor(private http: HttpClient) {}

  getAreasByCity(cityId: number): Observable<Area[]> {
    return this.http.get<Area[]>(
      `${this.apiUrl}/by-city/${cityId}`
    );
  }
}