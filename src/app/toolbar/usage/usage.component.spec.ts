import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsageComponent } from './usage.component';
import { beforeEach, describe, it } from 'node:test';

describe('UsageComponent', () => {
  let component: UsageComponent;
  let fixture: ComponentFixture<UsageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UsageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
