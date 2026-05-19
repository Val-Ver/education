import { TestBed } from '@angular/core/testing';

import { MockCategoriesService } from './mock-categories.service';

describe('MockCategoriesService', () => {
  let service: MockCategoriesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MockCategoriesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
