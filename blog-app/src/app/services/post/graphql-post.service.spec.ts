import { TestBed } from '@angular/core/testing';

import { GraphqlPostService } from './graphql-post.service';

describe('GraphqlPostService', () => {
  let service: GraphqlPostService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GraphqlPostService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
