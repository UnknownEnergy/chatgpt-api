import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveAsPdfComponent } from './save-as-pdf.component';

describe('SaveAsPdfComponent', () => {
  let component: SaveAsPdfComponent;
  let fixture: ComponentFixture<SaveAsPdfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [SaveAsPdfComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(SaveAsPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
