import { TestBed } from '@angular/core/testing';

import { PostStoreService } from './post-store.service';

describe('PostStoreService', () => {
  let service: PostStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PostStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
