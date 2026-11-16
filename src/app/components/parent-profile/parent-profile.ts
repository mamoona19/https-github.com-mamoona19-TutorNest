
import { Component, OnInit,ChangeDetectorRef } from '@angular/core';

import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import {
  ParentService,
  ParentProfile as ParentProfileModel
} from '../../Services/parent.service';

@Component({
  selector: 'app-parent-profile',
  standalone: true,
  imports: [RouterLink,DatePipe],
  templateUrl: './parent-profile.html',
  styleUrl: './parent-profile.css'
})
export class ParentProfile implements OnInit {

  profile: ParentProfileModel | null = null;

  isLoading = true;
  errorMessage = '';

  constructor(private parentService: ParentService,private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.parentService.getMyProfile().subscribe({
  next: (response) => {
    this.profile = response.data;
    this.isLoading = false;
    this.cdr.detectChanges();
  },
  error: (error) => {
    this.isLoading = false;
    this.errorMessage =
      error.error?.message || 'Unable to load parent profile.';
    this.cdr.detectChanges();
  }
});
  }

  get fullName(): string {
    if (!this.profile) return 'Parent';

    return `${this.profile.firstName} ${this.profile.lastName || ''}`.trim();
  }
}
