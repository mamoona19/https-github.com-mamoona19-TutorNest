import { TestBed } from '@angular/core/testing';
import { StudentServiceTs } from './student.service.ts';

describe('StudentServiceTs', () => {
  let service: StudentServiceTs;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StudentServiceTs);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
