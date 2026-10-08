import { Routes } from '@angular/router';

import { TutorDashboard } from './pages/tutor-dashboard/tutor-dashboard';
import { Home } from './pages/home/home';
import { Login } from './pages/login/login';
import { Signup } from './pages/signup/signup';
import { ParentDashboard } from './pages/parent-dashboard/parent-dashboard';
import { AdminApplicationsComponent } from './admin/admin-applications/admin-applications';

export const routes: Routes = [

  {
    path: '',
    component: Home
  },

  {
    path: 'login',
    component: Login
  },

  {
    path: 'signup',
    component: Signup
  },

  {
    path: 'tutor/dashboard',
    component: TutorDashboard
  },

  {
    path: 'parent/dashboard',
    component: ParentDashboard
  },

  {
    path: 'admin/dashboard',
    redirectTo: 'admin/applications',
    pathMatch: 'full'
  },

  {
  path: 'admin/applications',
  component: AdminApplicationsComponent,
  title: 'ADMIN TEST'
}

];