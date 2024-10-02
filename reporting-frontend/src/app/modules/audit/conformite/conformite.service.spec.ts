import { TestBed } from '@angular/core/testing';

import { ConformiteService } from './conformite.service';

describe('ConformiteService', () => {
  let service: ConformiteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConformiteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
