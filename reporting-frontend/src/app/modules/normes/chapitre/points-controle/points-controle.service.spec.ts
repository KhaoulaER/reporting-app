import { TestBed } from '@angular/core/testing';

import { PointsControleService } from './points-controle.service';

describe('PointsControleService', () => {
  let service: PointsControleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PointsControleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
