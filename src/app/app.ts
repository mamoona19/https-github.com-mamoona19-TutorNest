
import { Component, signal } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

import { Navbar } from './components/navbar/navbar';
import { AdminSidebar } from './components/admin-sidebar/admin-sidebar';
import { ParentSidebar } from './components/parent-sidebar/parent-sidebar';
import { TutorSidebar } from './components/tutor-sidebar/tutor-sidebar';

@Component({
  imports: [RouterOutlet, Navbar, AdminSidebar, ParentSidebar,TutorSidebar],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('TutorNest');

  isAdminRoute = false;
  isParentRoute = false;
isTutorRoute = false;

  constructor(private router: Router) {

    this.updateLayout();

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updateLayout();
      });
  }

 private updateLayout(): void {
  this.isAdminRoute = this.router.url.startsWith('/admin');

  const roleId = localStorage.getItem('roleId');

  this.isParentRoute = roleId === '2' && !this.isAdminRoute;
  this.isTutorRoute = roleId === '3' && !this.isAdminRoute;
}

}
