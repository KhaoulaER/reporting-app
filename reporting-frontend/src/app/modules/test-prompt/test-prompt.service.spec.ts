import { TestBed } from '@angular/core/testing';

import { TestPromptService } from './test-prompt.service';

describe('TestPromptService', () => {
  let service: TestPromptService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TestPromptService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
