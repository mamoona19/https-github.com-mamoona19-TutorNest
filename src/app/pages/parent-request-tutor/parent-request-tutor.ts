
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

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

import {
  TuitionRequestService
} from '../../Services/tuition-request.service';

@Component({
  selector: 'app-parent-request-tutor',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './parent-request-tutor.html',
  styleUrl: './parent-request-tutor.css'
})
export class ParentRequestTutor implements OnInit {

  requestForm: FormGroup;

  students: Student[] = [];
  subjects: Subject[] = [];
  cities: City[] = [];
  areas: Area[] = [];

  parentId = 0;

  isLoadingStudents = false;
  isLoadingSubjects = false;
  isLoadingCities = false;
  isLoadingAreas = false;

  studentError = '';
  subjectError = '';
  cityError = '';
  areaError = '';

  showRequestForm = true;

  loading = false;
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

      tuitionTypeId: [1, Validators.required],

      subjectId: ['', Validators.required],

      cityId: ['', Validators.required],

      areaId: ['', Validators.required],

      budget: [
        18000,
        [
          Validators.required,
          Validators.min(1)
        ]
      ],

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

  loadParentId(): void {

    this.parentService.getMyParentId().subscribe({

      next: (response) => {

        this.parentId = response.parentId;

      },

      error: (error) => {

        console.error('Parent ID Error:', error);

        this.errorMessage =
          'Unable to identify logged-in parent.';

      }

    });

  }

  loadStudents(): void {

    this.isLoadingStudents = true;
    this.studentError = '';

    this.studentService.getMyStudents().subscribe({

      next: (students) => {

        this.students = students || [];

        this.isLoadingStudents = false;

        if (this.students.length > 0) {

          this.requestForm.patchValue({
            studentId: this.students[0].studentId
          });

        } else {

          this.studentError =
            'No children found. Please add a child first.';

        }

      },

      error: (error) => {

        console.error('Student API Error:', error);

        this.students = [];
        this.studentError =
          `Unable to load students. Status: ${error.status}`;

        this.isLoadingStudents = false;

      }

    });

  }

  loadSubjects(): void {

    this.isLoadingSubjects = true;
    this.subjectError = '';

    this.subjectService.getSubjects().subscribe({

      next: (subjects) => {

        this.subjects = subjects || [];
        this.isLoadingSubjects = false;

      },

      error: (error) => {

        console.error('Subject API Error:', error);

        this.subjects = [];
        this.subjectError = 'Unable to load subjects.';
        this.isLoadingSubjects = false;

      }

    });

  }

  loadCities(): void {

    this.isLoadingCities = true;
    this.cityError = '';

    this.cityService.getCities().subscribe({

      next: (cities) => {

        this.cities = cities || [];
        this.isLoadingCities = false;

      },

      error: (error) => {

        console.error('City API Error:', error);

        this.cities = [];
        this.cityError = 'Unable to load cities.';
        this.isLoadingCities = false;

      }

    });

  }

  loadAreas(cityId: number): void {

    this.isLoadingAreas = true;
    this.areaError = '';
    this.areas = [];

    this.requestForm.patchValue({
      areaId: ''
    });

    if (!cityId) {

      this.isLoadingAreas = false;
      return;

    }

    this.areaService.getAreasByCity(cityId).subscribe({

      next: (areas) => {

        this.areas = areas || [];
        this.isLoadingAreas = false;

      },

      error: (error) => {

        console.error('Area API Error:', error);

        this.areas = [];
        this.areaError = 'Unable to load areas.';
        this.isLoadingAreas = false;

      }

    });

  }

  submitRequest(): void {

    this.successMessage = '';
    this.errorMessage = '';

    if (this.requestForm.invalid) {

      this.requestForm.markAllAsTouched();
      return;

    }

    if (!this.parentId) {

      this.errorMessage =
        'Unable to identify logged-in parent.';

      return;

    }

    this.loading = true;

    const formValue = this.requestForm.value;

    const request = {

      parentId: this.parentId,

      studentId: Number(formValue.studentId),

      tuitionTypeId: Number(formValue.tuitionTypeId),

      subjectId: Number(formValue.subjectId),

      cityId: Number(formValue.cityId),

      areaId: Number(formValue.areaId),

      budget: Number(formValue.budget),

      preferredTutorGenderId:
        Number(formValue.preferredTutorGenderId),

      preferredStartDate: formValue.preferredStartDate,

      specialInstructions: formValue.specialInstructions,

      createdBy: this.parentId

    };

    this.tuitionRequestService
      .createTuitionRequest(request)
      .subscribe({

        next: (response) => {

          console.log('Request created:', response);

          this.successMessage =
            'Tuition request submitted successfully.';

          this.loading = false;

          this.requestForm.reset({

            studentId: this.students.length
              ? this.students[0].studentId
              : '',

            tuitionTypeId: 1,

            subjectId: '',

            cityId: '',

            areaId: '',

            budget: 18000,

            preferredTutorGenderId: 0,

            preferredStartDate: '',

            specialInstructions: ''

          });

          this.areas = [];

          this.cdr.detectChanges();

        },

        error: (error) => {

          console.error('Create Request Error:', error);

          this.errorMessage =
            error.error?.message ||
            'Unable to submit tuition request.';

          this.loading = false;

          this.cdr.detectChanges();

        }

      });

  }

}
