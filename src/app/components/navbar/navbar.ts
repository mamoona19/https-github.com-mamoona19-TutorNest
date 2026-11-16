
import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {

  constructor(private router: Router) {}

  get isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  get roleId(): number {
    return Number(localStorage.getItem('roleId'));
  }

  get isParent(): boolean {
    return this.isLoggedIn && this.roleId === 2;
  }

  get isTutor(): boolean {
    return this.isLoggedIn && this.roleId === 3;
  }

  get isGuest(): boolean {
    return !this.isLoggedIn;
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('roleId');
    localStorage.removeItem('userId');
    localStorage.removeItem('firstName');
    localStorage.removeItem('lastName');
    localStorage.removeItem('email');

    this.router.navigate(['/']);
  }
  getFirstName(): string {
  return localStorage.getItem('firstName') || 'User';
}
get isAdmin(): boolean {
  return this.isLoggedIn && this.roleId === 1;
}

}
