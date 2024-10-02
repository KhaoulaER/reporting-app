import { TestBed } from '@angular/core/testing';

import { NormeAdopteService } from './norme-adopte/norme-adopte.service';

describe('NormeAdopteService', () => {
  let service: NormeAdopteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NormeAdopteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
