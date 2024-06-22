import { TestBed } from '@angular/core/testing';

import { NormesService } from './normes/normes.service';

describe('NormesService', () => {
  let service: NormesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NormesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
