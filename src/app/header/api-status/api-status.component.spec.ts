import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiStatusComponent } from './api-status.component';
import { beforeEach, describe, it } from 'node:test';

describe('ApiStatusComponent', () => {
  let component: ApiStatusComponent;
  let fixture: ComponentFixture<ApiStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApiStatusComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ApiStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
