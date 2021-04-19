import { TestBed } from '@angular/core/testing';

import { ImportVerificationService } from './import-verification.service';

describe('ImportVerificationService', () => {
  let service: ImportVerificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImportVerificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
