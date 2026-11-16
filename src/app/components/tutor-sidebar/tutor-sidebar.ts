
import { Component, OnInit, HostListener } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-tutor-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './tutor-sidebar.html',
  styleUrl: './tutor-sidebar.css'
})
export class TutorSidebar implements OnInit {

  firstName = 'Tutor';
  isProfileMenuOpen = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.firstName = localStorage.getItem('firstName') || 'Tutor';
  }

  toggleProfileMenu(): void {
    this.isProfileMenuOpen = !this.isProfileMenuOpen;
  }

  @HostListener('document:click')
  closeProfileMenu(): void {
    this.isProfileMenuOpen = false;
  }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
