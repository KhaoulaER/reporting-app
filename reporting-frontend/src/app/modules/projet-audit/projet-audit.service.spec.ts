import { TestBed } from '@angular/core/testing';

import { ProjetAuditService } from './projet-audit.service';

describe('ProjetAuditService', () => {
  let service: ProjetAuditService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProjetAuditService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
