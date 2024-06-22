import { TestBed } from '@angular/core/testing';

import { PreuveService } from './preuve/preuve.service';

describe('PreuveService', () => {
  let service: PreuveService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PreuveService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
