import { TestBed } from '@angular/core/testing';

import { RapportXlsxService } from './rapport-xlsx.service';

describe('RapportXlsxService', () => {
  let service: RapportXlsxService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RapportXlsxService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
