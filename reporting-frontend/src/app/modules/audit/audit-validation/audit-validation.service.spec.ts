import { TestBed } from '@angular/core/testing';

import { AuditValidationService } from './audit-validation.service';

describe('AuditValidationService', () => {
  let service: AuditValidationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuditValidationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
