import { TestBed } from '@angular/core/testing';

import { ProducttagService } from './producttag.service';

describe('ProducttagService', () => {
  let service: ProducttagService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProducttagService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
