import { TestBed } from '@angular/core/testing';

import { CredentialChangeService } from './credential-change.service';

describe('CredentialChangeService', () => {
  let service: CredentialChangeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CredentialChangeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
