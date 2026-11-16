import { TestBed } from '@angular/core/testing';
import { TutorProfile } from './tutor-profile';

describe('TutorProfile', () => {
  let service: TutorProfile;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TutorProfile);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
