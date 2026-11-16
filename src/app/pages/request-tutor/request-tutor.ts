
import { Component, OnInit ,ChangeDetectorRef} from '@angular/core';
import { CommonModule } from '@angular/common';


import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { finalize,forkJoin } from 'rxjs';

import {
  TuitionRequestService,
  CreateTuitionRequest
} from '../../Services/tuition-request.service';

import {
  Student,
  StudentService
} from '../../Services/student.service';

import {
  Subject,
  SubjectService
} from '../../Services/subject.service';

import {
  City,
  CityService
} from '../../Services/city.service';

import {
  Area,
  AreaService
} from '../../Services/area.service';

import { ParentService } from '../../Services/parent.service';

@Component({
  selector: 'app-request-tutor',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './request-tutor.html',
  styleUrl: './request-tutor.css'
})
export class RequestTutor implements OnInit {
  requestForm: FormGroup;

  students: Student[] = [];
  subjects: Subject[] = [];
  cities: City[] = [];
  areas: Area[] = [];
hasSubmitted = false;
  parentId = 0;
areaError = '';
  isLoading = false;
  isLoadingStudents = false;
  isLoadingSubjects = false;
  isLoadingCities = false;
  isLoadingAreas = false;

  loadingError = '';
  successMessage = '';
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private tuitionRequestService: TuitionRequestService,
    private studentService: StudentService,
    private subjectService: SubjectService,
    private cityService: CityService,
    private areaService: AreaService,
    private parentService: ParentService,
    private cdr: ChangeDetectorRef
  ) {
    this.requestForm = this.fb.group({
      studentId: ['', Validators.required],
      tuitionTypeId: ['', Validators.required],
      subjectId: ['', Validators.required],
      cityId: ['', Validators.required],
      areaId: ['', Validators.required],
      budget: [18000, [
        Validators.required,
        Validators.min(1)
      ]],
      preferredTutorGenderId: [0],
      preferredStartDate: ['', Validators.required],
      specialInstructions: ['']
    });
  }

  ngOnInit(): void {
    this.loadStudents();
    this.loadSubjects();
    this.loadCities();
    this.loadParentId();
  }

  loadStudents(): void {
    this.isLoadingStudents = true;

    this.studentService.getMyStudents().subscribe({
      next: (data) => {
        this.students = data || [];
        this.isLoadingStudents = false;

        if (this.students.length > 0) {
          this.requestForm.patchValue({
            studentId: this.students[0].studentId
          });
        } else {
          this.loadingError =
            'Please add a student profile before requesting a tutor.';
        }
      },
      error: (error) => {
        console.error('Students loading error:', error);
        this.isLoadingStudents = false;
        this.loadingError = 'Unable to load students.';
      }
    });
  }

  loadSubjects(): void {
    this.isLoadingSubjects = true;

    this.subjectService.getSubjects().subscribe({
      next: (data) => {
        this.subjects = data || [];
        this.isLoadingSubjects = false;
      },
      error: (error) => {
        console.error('Subjects loading error:', error);
        this.isLoadingSubjects = false;
        this.loadingError = 'Unable to load subjects.';
      }
    });
  }

  loadCities(): void {
    this.isLoadingCities = true;

    this.cityService.getCities().subscribe({
      next: (data) => {
        this.cities = data || [];
        this.isLoadingCities = false;
      },
      error: (error) => {
        console.error('Cities loading error:', error);
        this.isLoadingCities = false;
        this.loadingError = 'Unable to load cities.';
      }
    });
  }

  loadAreas(cityId: number): void {
    this.areas = [];
    this.requestForm.patchValue({ areaId: '' });
    this.errorMessage = '';

    if (!cityId) {
      this.isLoadingAreas = false;
      return;
    }

    this.isLoadingAreas = true;

    this.areaService.getAreasByCity(Number(cityId)).subscribe({
      next: (data) => {
        this.areas = data || [];
        this.isLoadingAreas = false;

        if (this.areas.length === 0) {
          this.errorMessage =
            'No areas are available for the selected city.';
        }
      },
      error: (error) => {
        console.error('Areas loading error:', error);
        this.areas = [];
        this.isLoadingAreas = false;
        this.errorMessage = 'Unable to load areas.';
      }
    });
  }

  loadParentId(): void {
    this.parentService.getMyParentId().subscribe({
      next: (response) => {
        this.parentId = Number(response?.parentId || 0);
      },
      error: (error) => {
        console.error('Parent ID loading error:', error);
        this.loadingError =
          'Unable to identify the logged-in parent. Please log in again.';
      }
    });
  }

  


submitRequest(): void {
  if (this.isLoading) {
    return;
  }

  this.successMessage = '';
  this.errorMessage = '';

  // Validate required fields
  if (this.requestForm.invalid) {
    this.requestForm.markAllAsTouched();
    this.errorMessage =
      'Please correct the required fields highlighted in red.';

    this.cdr.detectChanges();
    return;
  }

  // Verify logged-in parent
  if (!this.parentId) {
    this.errorMessage =
      'Unable to identify your parent account. Please log in again.';

    this.cdr.detectChanges();
    return;
  }

  const formValue = this.requestForm.getRawValue();

  const request: CreateTuitionRequest = {
    parentId: this.parentId,
    studentId: Number(formValue.studentId),
    tuitionTypeId: Number(formValue.tuitionTypeId),
    subjectId: Number(formValue.subjectId),
    cityId: Number(formValue.cityId),
    areaId: Number(formValue.areaId),
    budget: Number(formValue.budget),

    preferredTutorGenderId:
      formValue.preferredTutorGenderId === null ||
      formValue.preferredTutorGenderId === ''
        ? 0
        : Number(formValue.preferredTutorGenderId),

    preferredStartDate: formValue.preferredStartDate || '',
    specialInstructions: formValue.specialInstructions || '',
    createdBy: this.parentId
  };

  this.isLoading = true;
  this.cdr.detectChanges();

  console.log('Tuition request started:', request);

  this.tuitionRequestService
    .createTuitionRequest(request)
    .pipe(
      finalize(() => {
  console.log('Before reset:', this.isLoading);

  this.isLoading = false;

  console.log('After reset:', this.isLoading);

  this.cdr.detectChanges();
})
    )
    .subscribe({
      next: (response) => {
        console.log('Tuition request success:', response);

        this.successMessage =
          response?.message ||
          'Tuition request submitted successfully.';

        this.errorMessage = '';

        // Clear the form after successful submission
        this.requestForm.reset({
          studentId: '',
          tuitionTypeId: '',
          subjectId: '',
          cityId: '',
          areaId: '',
          budget: 18000,
          preferredTutorGenderId: 0,
          preferredStartDate: '',
          specialInstructions: ''
        });

        this.cdr.detectChanges();
      },

      error: (error) => {
        console.error('Tuition request failed:', error);

        this.successMessage = '';

        const apiMessage = error?.error?.message;

        if (
          error?.status === 409 ||
          apiMessage?.includes(
            'An identical pending or active tuition request already exists'
          )
        ) {
          this.errorMessage =
            'You already have an active tuition request with these details. ' +
            'Please check your existing requests or change the student or tuition details.';
        } else {
          this.errorMessage =
            apiMessage ||
            'Unable to submit your tuition request. Please try again.';
        }

        this.cdr.detectChanges();
      }
    });
}



}
