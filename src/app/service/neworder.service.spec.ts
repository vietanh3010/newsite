import { TestBed } from '@angular/core/testing';

import { NeworderService } from './neworder.service';

describe('NeworderService', () => {
  let service: NeworderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NeworderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
