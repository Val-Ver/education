import { TestBed } from '@angular/core/testing';

import { LocalStorageArticlesDataService } from './local-storage-articles-data.service';

describe('LocalStorageArticlesDataService', () => {
  let service: LocalStorageArticlesDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocalStorageArticlesDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
