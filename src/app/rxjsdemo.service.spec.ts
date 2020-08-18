import { TestBed } from '@angular/core/testing';

import { RxjsDemoService } from './rxjsdemo.service';

describe('RxjsDemoService', () => {
  let service: RxjsDemoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RxjsdemoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
