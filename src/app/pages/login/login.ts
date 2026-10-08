
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs/operators';
import { ChangeDetectorRef } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { AuthService } from '../../Services/auth.service';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,

  private cdr: ChangeDetectorRef
  ) {

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });

  }

 onLogin(): void {

  if (this.loginForm.invalid) {
    this.loginForm.markAllAsTouched();
    return;
  }

  this.isLoading = true;
  this.errorMessage = '';

  this.authService.login(this.loginForm.value).subscribe({

    next: (response) => {

      console.log('LOGIN SUCCESS:', response);

      this.isLoading = false;

      localStorage.setItem('token', response.token);
      localStorage.setItem('userId', response.userId.toString());
      localStorage.setItem('roleId', response.roleId.toString());
      localStorage.setItem('firstName', response.firstName);
      localStorage.setItem('lastName', response.lastName);
      localStorage.setItem('email', response.email);

      if (response.roleId === 3) {
        this.router.navigate(['/tutor/dashboard']);
      }
      else if (response.roleId === 2) {
        this.router.navigate(['/parent/dashboard']);
      }
      else if (response.roleId === 1) {
        this.router.navigate(['/admin/dashboard']);
      }
      else {
        this.errorMessage = 'Invalid user role.';
      }
    },

 error: (error) => {

  console.log('========== ERROR HANDLER ==========');
  console.log('STATUS:', error.status);

  this.isLoading = false;

  if (error.status === 401) {
    this.errorMessage =
      error.error?.message ||
      'Invalid email or password.';
  } else {
    this.errorMessage =
      'Unable to login. Please try again.';
  }

  console.log('isLoading:', this.isLoading);
  console.log('errorMessage:', this.errorMessage);

  this.cdr.detectChanges();
}
  });
}
}

