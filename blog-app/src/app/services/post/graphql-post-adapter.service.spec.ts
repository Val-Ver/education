import { TestBed } from '@angular/core/testing';

import { GraphqlPostAdapterService } from './graphql-post-adapter.service';

describe('GraphqlPostAdapterService', () => {
  let service: GraphqlPostAdapterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GraphqlPostAdapterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
