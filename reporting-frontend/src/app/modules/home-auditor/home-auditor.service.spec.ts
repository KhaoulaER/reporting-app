import { TestBed } from '@angular/core/testing';

import { HomeAuditorService } from './home-auditor.service';

describe('HomeAuditorService', () => {
  let service: HomeAuditorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HomeAuditorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
