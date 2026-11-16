
import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-parent-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './parent-sidebar.html',
  styleUrl: './parent-sidebar.css'
})
export class ParentSidebar {

  firstName = localStorage.getItem('firstName') || 'Parent';

  constructor(private router: Router) {}
  isProfileMenuOpen = false;

toggleProfileMenu(): void {
  this.isProfileMenuOpen = !this.isProfileMenuOpen;
}
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('roleId');
    localStorage.removeItem('firstName');
    localStorage.removeItem('lastName');
    localStorage.removeItem('email');

    this.router.navigate(['/']);
  }

}
