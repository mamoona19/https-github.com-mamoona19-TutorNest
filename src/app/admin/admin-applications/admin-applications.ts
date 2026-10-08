import { Component,ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService,PendingDemoRequest,TutorDemoAvailability } from '../../Services/admin.service';


@Component({
  selector: 'app-admin-applications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-applications.html',
  styleUrl: './admin-applications.css'
})
export class AdminApplicationsComponent {

  applications: any[] = [];

  isLoading = false;
  errorMessage = '';
  pendingDemoRequests: any[] = [];
isLoadingDemos = false;
demoError = '';
selectedDemo: any = null;
demoAvailability: TutorDemoAvailability[] = [];
isLoadingAvailability = false;
availabilityError = '';

 constructor(private adminService: AdminService,private cdr: ChangeDetectorRef) {

  console.log('ADMIN COMPONENT CREATED');

  
}
ngOnInit(): void {
  this.loadApplications();
  this.loadPendingDemoRequests();
}
loadApplications(): void {

  this.isLoading = true;

  this.adminService.getTutorApplications().subscribe({

    next: (response) => {

      this.applications = [...response];

      console.log(
        'APPLICATIONS:',
        this.applications.length
      );

      this.isLoading = false;

      this.cdr.detectChanges();
    },

    error: (error) => {

      console.error('API ERROR:', error);

      this.errorMessage =
        error?.error?.message ||
        'Unable to load tutor applications.';

      this.isLoading = false;

      this.cdr.detectChanges();
    }

  });
}

  approveApplication(application: any): void {

    this.adminService.updateTutorApplication(
      application.requestTutorId,
      2,
      'Approved by Admin'
    ).subscribe({

      next: () => {
        this.loadApplications();
      },

      error: (error) => {
        console.error('APPROVE ERROR:', error);
      }

    });
  }

  rejectApplication(application: any): void {

    this.adminService.updateTutorApplication(
      application.requestTutorId,
      3,
      'Rejected by Admin'
    ).subscribe({

      next: () => {
        this.loadApplications();
      },

      error: (error) => {
        console.error('REJECT ERROR:', error);
      }

    });
  }
  loadPendingDemoRequests(): void {

  this.isLoadingDemos = true;
  this.demoError = '';

  this.adminService
    .getPendingDemoRequests()
    .subscribe({

      next: (response) => {

        console.log(
          'PENDING DEMO REQUESTS:',
          response
        );

        this.pendingDemoRequests =
          response || [];

        this.isLoadingDemos = false;
      },

      error: (error) => {

        console.error(
          'PENDING DEMO ERROR:',
          error
        );

        this.pendingDemoRequests = [];
        this.isLoadingDemos = false;

        this.demoError =
          'Unable to load pending demo requests.';
      }

    });
}
showDemoAvailability(demo: any): void {
  this.selectedDemo = demo;
  this.demoAvailability = [];
  this.isLoadingAvailability = true;
  this.availabilityError = '';

  this.adminService
    .getDemoAvailability(demo.tutorDemoRequestId)
    .subscribe({
      next: (response) => {
        console.log('DEMO AVAILABILITY:', response);

        this.demoAvailability = response || [];
        this.isLoadingAvailability = false;

        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('AVAILABILITY ERROR:', error);

        this.demoAvailability = [];
        this.isLoadingAvailability = false;

        this.availabilityError =
          error?.error?.message ||
          'Unable to load demo availability.';

        this.cdr.detectChanges();
      }
    });
}
selectDemoSlot(
  demo: any,
  slot: TutorDemoAvailability
): void {

  console.log('SELECTED DEMO:', demo);
  console.log('SELECTED SLOT:', slot);

  this.adminService
    .scheduleTutorDemo(
      demo.tutorDemoRequestId,
      slot.availabilityId,
      'Demo scheduled by Admin.'
    )
    .subscribe({
      next: (response: any) => {
        console.log('DEMO SCHEDULED:', response);

        this.selectedDemo = null;
        this.demoAvailability = [];

        this.loadPendingDemoRequests();
        this.loadApplications();
      },
      error: (error: any) => {
        console.error('SCHEDULE DEMO ERROR:', error);

        this.availabilityError =
          error?.error?.message ||
          'Unable to schedule demo.';

        this.cdr.detectChanges();
      }
    });
}
selectTutor(application: any): void {

  const confirmed = confirm(
    `Are you sure you want to select Tutor #${application.tutorId} for Tuition Request #${application.tuitionRequestId}?`
  );

  if (!confirmed) {
    return;
  }

  console.log(
    'SELECT TUTOR:',
    application.requestTutorId
  );

  this.adminService
    .selectTutor(application.requestTutorId)
    .subscribe({

      next: (response: any) => {

        console.log(
          'TUTOR SELECTED:',
          response
        );

        this.loadApplications();
      },

      error: (error: any) => {

        console.error(
          'SELECT TUTOR ERROR:',
          error
        );

        this.errorMessage =
          error?.error?.message ||
          'Unable to select tutor.';

        this.cdr.detectChanges();
      }

    });
}
isTutorSelected(application: any): boolean {

  return application.isSelected === true ||
         application.isSelected === 1;
}


isAnotherTutorSelected(application: any): boolean {

  return this.applications.some(
    x =>
      x.tuitionRequestId === application.tuitionRequestId &&
      x.requestTutorId !== application.requestTutorId &&
      (x.isSelected === true || x.isSelected === 1)
  );
}
}