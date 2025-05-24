import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportConfigComponent } from './export-config.component';

describe('ExportConfigComponent', () => {
  let component: ExportConfigComponent;
  let fixture: ComponentFixture<ExportConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExportConfigComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExportConfigComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput("conversations", [])
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
