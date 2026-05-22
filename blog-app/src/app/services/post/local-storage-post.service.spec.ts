import { TestBed } from '@angular/core/testing';

import { LocalStoragePostService } from './local-storage-post.service';

describe('LocalStoragePostService', () => {
  let service: LocalStoragePostService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocalStoragePostService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
