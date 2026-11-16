
import { Component, OnInit ,ChangeDetectorRef} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ParentService } from '../../Services/parent.service';


@Component({
  selector: 'app-parent-my-demos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './parent-my-demos.html',
  styleUrl: './parent-my-demos.css'
})
export class ParentMyDemos implements OnInit {

  parentDemoRequests: any[] = [];
  isLoadingDemos = false;
  confirmingDemoId: number | null = null;

  constructor(
    private parentService: ParentService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadParentDemoRequests();
  }

loadParentDemoRequests(): void {
  this.isLoadingDemos = true;
  this.cdr.detectChanges();

  this.parentService.getMyDemoRequests().subscribe({
    next: (data) => {
      console.log('PARENT DEMOS:', data);

      this.parentDemoRequests = Array.isArray(data) ? data : [];
      this.isLoadingDemos = false;

      this.cdr.detectChanges();
    },
    error: (error) => {
      console.error('Error loading parent demos:', error);

      this.parentDemoRequests = [];
      this.isLoadingDemos = false;

      this.cdr.detectChanges();
    }
  });
}


  confirmParentDemo(demo: any): void {

    const demoId = Number(demo.tutorDemoRequestId);

    if (!demoId || this.confirmingDemoId !== null) {
      return;
    }

    if (demo.demoStatusName?.toLowerCase() !== 'tutor confirmed') {
      return;
    }

    if (!confirm('Are you sure you want to confirm this demo?')) {
      return;
    }

    this.confirmingDemoId = demoId;

    this.parentService.confirmParentDemo(demoId).subscribe({

      next: (response) => {
        alert(response.message || 'Demo confirmed successfully.');

        this.loadParentDemoRequests();
        this.confirmingDemoId = null;
      },

      error: (error) => {
        console.error('PARENT DEMO CONFIRMATION ERROR:', error);

        alert(
          error.error?.message ||
          'Unable to confirm demo. Please try again.'
        );

        this.confirmingDemoId = null;
      }

    });
  }
}
