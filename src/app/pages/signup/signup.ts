import { Component } from '@angular/core';
import { Router,RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../Services/auth.service';

import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

@Component({
  selector: 'app-signup',
  imports: [
    RouterLink,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './signup.html',
  styleUrl: './signup.css'
})
export class Signup {

  signupForm: FormGroup;
successMessage = '';
errorMessage = '';
isSubmitting = false;
 constructor(private fb: FormBuilder,
  private authService: AuthService,
  private router: Router
 )
{
  this.signupForm = this.fb.group({

    accountType: ['parent', Validators.required],

    firstName: ['', [Validators.required, Validators.minLength(2)]],

    lastName: ['', [Validators.required, Validators.minLength(2)]],

    email: ['', [Validators.required, Validators.email]],

    phone: ['', [Validators.required, Validators.pattern(/^03[0-9]{9}$/)]],

    password: ['', [Validators.required, Validators.minLength(8)]],

    confirmPassword: ['', [Validators.required]],

    terms: [false, Validators.requiredTrue]

  });


  this.signupForm.get('password')?.valueChanges.subscribe(() => {
    this.checkPasswordMatch();
  });

  this.signupForm.get('confirmPassword')?.valueChanges.subscribe(() => {
    this.checkPasswordMatch();
  });


  // 👇 YE NEW CODE HAI
  this.signupForm.get('accountType')?.valueChanges.subscribe(() => {

    Object.keys(this.signupForm.controls).forEach(controlName => {

      if (controlName !== 'accountType') {

        const control = this.signupForm.get(controlName);

        control?.reset('');
        control?.markAsPristine();
        control?.markAsUntouched();
       

      }
      

    });

  });

}
private checkPasswordMatch(): void {

  const passwordControl = this.signupForm.get('password');
  const confirmControl = this.signupForm.get('confirmPassword');

  const password = passwordControl?.value;
  const confirmPassword = confirmControl?.value;

  // Empty confirm password
  // Validators.required khud isko handle karega
  if (!confirmPassword) {
    const errors = { ...confirmControl?.errors };

    delete errors['passwordMismatch'];

    confirmControl?.setErrors(
      Object.keys(errors).length > 0 ? errors : null
    );

    return;
  }

  // Passwords don't match
  if (password !== confirmPassword) {

    confirmControl?.setErrors({
      ...confirmControl.errors,
      passwordMismatch: true
    });

  } else {

    const errors = { ...confirmControl.errors };

    delete errors['passwordMismatch'];

    confirmControl?.setErrors(
      Object.keys(errors).length > 0 ? errors : null
    );
  }
}
 onSubmit(): void {

  this.checkPasswordMatch();

  this.signupForm.markAllAsTouched();

  console.log('INVALID:', this.signupForm.invalid);

  Object.keys(this.signupForm.controls).forEach(controlName => {

    const control = this.signupForm.get(controlName);

    console.log(
      controlName,
      'value:', control?.value,
      'invalid:', control?.invalid,
      'errors:', control?.errors
    );

  });

  if (this.signupForm.invalid) {
    return;
  }
  if (this.isSubmitting) {
  return;
}

  // API call start
  this.isSubmitting = true;

  const formValue = this.signupForm.value;

  const registerData = {
    firstName: formValue.firstName,
    lastName: formValue.lastName,
    email: formValue.email,
    phoneNumber: formValue.phone,
    password: formValue.password,
    roleId: formValue.accountType === 'parent' ? 2 : 3
  };

  console.log('Register Data:', registerData);

  this.authService.register(registerData).subscribe({

    next: (response) => {

      console.log('Registration Successful:', response);

      this.isSubmitting = false;
      this.successMessage = response.message;

      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 1500);

    },

    error: (error) => {

      console.log('FULL ERROR:', error);
      console.log('ERROR BODY:', error.error);
      console.log('MESSAGE:', error.error?.message);

      this.isSubmitting = false;

      this.errorMessage =
        error.error?.message ||
        'Registration failed. Please try again.';
    }

  });
}
}