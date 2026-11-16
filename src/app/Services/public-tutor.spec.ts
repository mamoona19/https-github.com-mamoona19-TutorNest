import { TestBed } from '@angular/core/testing';
import { PublicTutor } from './public-tutor';

describe('PublicTutor', () => {
  let service: PublicTutor;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PublicTutor);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
