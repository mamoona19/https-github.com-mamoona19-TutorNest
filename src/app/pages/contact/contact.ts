
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import {
  ContactService,
  ContactInquiry
} from '../../Services/contact';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './contact.html',
  styleUrl: './contact.css'
})
export class Contact {
  contact: ContactInquiry = {
    fullName: '',
    email: '',
    roleName: '',
    subject: '',
    message: ''
  };

  isSubmitting = false;
  formMessage = '';
  isError = false;

  constructor(private contactService: ContactService) {}
onFormChange(form: NgForm): void {
  if (form.valid && this.isError) {
    this.formMessage = '';
    this.isError = false;
  }
}
  submitContact(form: NgForm): void {
    this.formMessage = '';
    this.isError = false;

    if (form.invalid) {
      form.control.markAllAsTouched();
      this.formMessage =
        'Please complete all required fields correctly.';
      this.isError = true;
      return;
    }

    this.isSubmitting = true;

    this.contactService.submitInquiry(this.contact).subscribe({
      next: (response) => {
        this.formMessage =
          response.message ||
          'Your inquiry has been submitted successfully.';

        this.isError = false;

        this.contact = {
          fullName: '',
          email: '',
          roleName: '',
          subject: '',
          message: ''
        };

        form.resetForm(this.contact);
        this.isSubmitting = false;
      },

      error: (error: HttpErrorResponse) => {
        this.isSubmitting = false;
        this.isError = true;

        this.formMessage =
          error.error?.message ||
          'Unable to submit your inquiry. Please try again.';
      }
    });
  }
}
