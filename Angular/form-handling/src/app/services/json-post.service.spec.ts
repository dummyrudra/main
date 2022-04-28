import { TestBed } from '@angular/core/testing';

import { JsonPostService } from './json-post.service';

describe('JsonPostService', () => {
  let service: JsonPostService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JsonPostService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
