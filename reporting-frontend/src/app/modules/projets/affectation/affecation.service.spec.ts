import { TestBed } from '@angular/core/testing';

import { AffecationService } from './affecation.service';

describe('AffecationService', () => {
  let service: AffecationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AffecationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
