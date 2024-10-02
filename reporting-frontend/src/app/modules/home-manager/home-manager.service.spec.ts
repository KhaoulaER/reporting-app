import { TestBed } from '@angular/core/testing';

import { HomeManagerService } from './home-manager.service';

describe('HomeManagerService', () => {
  let service: HomeManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HomeManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
