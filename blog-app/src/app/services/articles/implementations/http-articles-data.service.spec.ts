import { TestBed } from '@angular/core/testing';

import { HttpArticlesDataService } from './http-articles-data.service';

describe('HttpArticlesDataService', () => {
  let service: HttpArticlesDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HttpArticlesDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
