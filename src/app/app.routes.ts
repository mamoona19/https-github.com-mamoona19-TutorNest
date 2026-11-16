
import { Routes } from '@angular/router';

import { TutorDashboard } from './pages/tutor-dashboard/tutor-dashboard';
import { Home } from './pages/home/home';
import { Login } from './pages/login/login';
import { Signup } from './pages/signup/signup';
import { ParentDashboard } from './pages/parent-dashboard/parent-dashboard';

import { FindTutor } from './pages/find-tutor/find-tutor';
import { RequestTutor } from './pages/request-tutor/request-tutor';
import { AboutUs } from './pages/about-us/about-us';
import { Contact } from './pages/contact/contact';

import { AdminApplicationsComponent } from './admin/admin-applications/admin-applications';
import { PaymentAccountSettingsComponent } from './admin/payment-account-settings/payment-account-settings';
import { PendingPaymentsComponent } from './admin/pending-payments/pending-payments';
import { AdminTutorVerificationComponent } from './components/admin-tutor-verification/admin-tutor-verification';
import { Faq } from './pages/faq/faq';
import { Privacy } from './pages/privacy/privacy';
import { Terms } from './pages/terms/terms';
import { Help } from './pages/help/help';
import { TutorProfile } from './pages/tutor-profile/tutor-profile';
import { TutorAvailableRequests } from './pages/tutor-available-requests/tutor-available-requests';
import { TutorMyProfile } from './pages/tutor-my-profile/tutor-my-profile';
import { ParentProfile } from './components/parent-profile/parent-profile';
import { TutorMyApplications } from './pages/tutor-my-applications/tutor-my-applications';
import { TutorMyDemos } from './pages/tutor-my-demos/tutor-my-demos';
import { TutorActiveTuitions } from './pages/tutor-active-tuitions/tutor-active-tuitions';
import { ParentRequestTutor } from './pages/parent-request-tutor/parent-request-tutor';
import { ParentMyRequests } from './pages/parent-my-requests/parent-my-requests';
import { ParentMyDemos } from './pages/parent-my-demos/parent-my-demos';
import { ParentMyInvoices } from './pages/parent-my-invoices/parent-my-invoices';

export const routes: Routes = [
  {
    path: '',
    component: Home,
    title: 'TutorNest | Home'
  },
  {
    path: 'find-tutor',
    component: FindTutor,
    title: 'Find a Tutor'
  },
  {
    path: 'request-tutor',
    component: RequestTutor,
    title: 'Request a Tutor'
  },
  {
    path: 'about',
    component: AboutUs,
    title: 'About Us'
  },
  {
    path: 'contact',
    component: Contact,
    title: 'Contact Us'
  },
  {
    path: 'login',
    component: Login,
    title: 'Login'
  },
  {
    path: 'signup',
    component: Signup,
    title: 'Sign Up'
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
    component: AdminApplicationsComponent
  },
  {
    path: 'admin/payment-account-settings',
    component: PaymentAccountSettingsComponent
  },
  {
    path: 'admin/pending-payments',
    component: PendingPaymentsComponent
  },
  {
    path: 'admin/tutor-verification',
    component: AdminTutorVerificationComponent
  },
  {
  path: 'faq',
  component: Faq,
  title: 'FAQs'
},
{
  path: 'privacy',
  component: Privacy,
  title: 'Privacy Policy'
},
{
  path: 'terms',
  component: Terms,
  title: 'Terms & Conditions'
},
{
  path: 'help',
  component: Help,
  title: 'Help Center'
},
{
  path: 'tutor-profile/:id',
  component: TutorProfile,
  title: 'Tutor Profile'
},
{
  path: 'tutor/available-requests',
  component: TutorAvailableRequests,
  title: 'Available Tuition Requests'
},
{
  path: 'tutor/profile',
  component: TutorMyProfile,
  title: 'My Tutor Profile'
},
{
  path: 'parent/profile',
  component: ParentProfile,
  title: 'My Parent Profile'
},
{
  path: 'tutor/my-applications',
  component: TutorMyApplications,
  title: 'My Applications'
},
{
  path: 'tutor/my-demos',
  component: TutorMyDemos,
  title: 'My Demos'
},
{
  path: 'tutor/active-tuitions',
  component: TutorActiveTuitions,
  title: 'Active Tuitions'
},
{
  path: 'parent/request-tutor',
  component: ParentRequestTutor,
  title: 'Request a Tutor'
},
{
  path: 'parent/my-requests',
  component: ParentMyRequests,
  title: 'My Tuition Requests'
},
{
  path: 'parent/my-demos',
  component: ParentMyDemos,
  title: 'My Demos'
},
{
  path: 'parent/my-invoices',
  component: ParentMyInvoices,
  title: 'My Invoices'
},
];
