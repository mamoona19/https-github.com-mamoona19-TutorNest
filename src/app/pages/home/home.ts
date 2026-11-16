
import { Component, OnInit, OnDestroy,ChangeDetectorRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PublicTutorService, PublicTutor } from '../../Services/public-tutor.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit, OnDestroy {
constructor(private cdr: ChangeDetectorRef,
  private publicTutorService: PublicTutorService) {}
  testimonials = [
    {
      message: "TutorNest made it much easier to find a tutor according to my child's subject and learning needs.",
      initial: 'A',
      role: 'Parent',
      location: 'Islamabad'
    },
    {
      message: 'I wanted a tutor within my budget and preferred a home tuition option. The process was simple and convenient.',
      initial: 'S',
      role: 'Parent',
      location: 'Rawalpindi'
    },
    {
      message: 'The platform gives tutors a great way to connect with students who are actually looking for their subjects.',
      initial: 'M',
      role: 'Tutor',
      location: 'Islamabad'
    }
  ];
tutors: PublicTutor[] = [];
isLoadingTutors = false;
tutorError = '';
  currentTestimonialIndex = 0;

  private testimonialTimer?: ReturnType<typeof setInterval>;

 ngOnInit(): void {
  this.startTestimonialSlider();
  this.loadPublicTutors();
}

ngOnDestroy(): void {
  this.stopTestimonialSlider();
}
 

private startTestimonialSlider(): void {
  this.stopTestimonialSlider();

  this.testimonialTimer = setInterval(() => {
    this.nextTestimonial();
  }, 5000);
}

 
 

  private stopTestimonialSlider(): void {
    if (this.testimonialTimer) {
      clearInterval(this.testimonialTimer);
      this.testimonialTimer = undefined;
    }
  }
  
nextTestimonial(): void {
  this.currentTestimonialIndex =
    (this.currentTestimonialIndex + 1) % this.testimonials.length;

  this.cdr.markForCheck();
}

previousTestimonial(): void {
  this.currentTestimonialIndex =
    (this.currentTestimonialIndex - 1 + this.testimonials.length)
    % this.testimonials.length;

  this.cdr.markForCheck();
}

showTestimonial(index: number): void {
  if (index < 0 || index >= this.testimonials.length) {
    return;
  }

  this.currentTestimonialIndex = index;
  this.cdr.markForCheck();
}
loadPublicTutors(): void {
  this.isLoadingTutors = true;
  this.tutorError = '';

  this.publicTutorService.getPublicTutors().subscribe({
    next: (response) => {
      this.tutors = response;
      this.isLoadingTutors = false;
      this.cdr.markForCheck();
    },
    error: (error) => {
      console.error('Error loading public tutors:', error);
      this.tutorError = 'Unable to load tutors. Please try again later.';
      this.isLoadingTutors = false;
      this.cdr.markForCheck();
    }
  });
}

}
