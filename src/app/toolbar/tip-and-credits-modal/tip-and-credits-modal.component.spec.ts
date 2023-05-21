import {ComponentFixture, TestBed} from '@angular/core/testing';

import {TipAndCreditsModalComponent} from './tip-and-credits-modal.component';

describe('TipModalComponent', () => {
  let component: TipAndCreditsModalComponent;
  let fixture: ComponentFixture<TipAndCreditsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TipAndCreditsModalComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(TipAndCreditsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
