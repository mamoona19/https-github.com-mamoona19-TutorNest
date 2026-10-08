import { TestBed } from '@angular/core/testing';
import { TuitionRequest } from './tuition-request';

describe('TuitionRequest', () => {
  let service: TuitionRequest;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TuitionRequest);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
