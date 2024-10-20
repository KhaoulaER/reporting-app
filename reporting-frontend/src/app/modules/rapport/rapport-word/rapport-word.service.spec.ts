import { TestBed } from '@angular/core/testing';

import { RapportWordService } from './rapport-word.service';

describe('RapportWordService', () => {
  let service: RapportWordService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RapportWordService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
