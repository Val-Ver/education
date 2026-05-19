import { TestBed } from '@angular/core/testing';

import { HttpCategoriesService } from './http-categories.service';

describe('HttpCategoriesService', () => {
  let service: HttpCategoriesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HttpCategoriesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
