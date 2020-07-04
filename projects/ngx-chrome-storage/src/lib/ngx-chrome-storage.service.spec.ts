import { TestBed } from '@angular/core/testing';

import { NgxNgxChromeStorageServiceService } from './ngx-chrome-storage.service';

describe('NgxNgxChromeStorageServiceService', () => {
  let service: NgxNgxChromeStorageServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxNgxChromeStorageServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
