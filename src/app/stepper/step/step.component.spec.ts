import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepComponent } from './step.component';
import { By } from '@angular/platform-browser';

describe('StepComponent', () => {
  let component: StepComponent;
  let fixture: ComponentFixture<StepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StepComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput("step", 1)
    fixture.componentRef.setInput("label", "label")
    fixture.componentRef.setInput("current", false)
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it("should not be highlighted if not current", () => {
    fixture.componentRef.setInput("current", false)
    fixture.detectChanges()

    let result = fixture.debugElement.query(By.css(".is-primary"))
    expect(result).toBeNull()
  })

  it("should be highlighted if current", () => {
    fixture.componentRef.setInput("current", true)
    fixture.detectChanges()

    let result = fixture.debugElement.query(By.css(".is-primary"))
    expect(result).not.toBeNull()
  })

  it("should display the step number in title and label in subtitle", () => {
    let title = fixture.debugElement.query(By.css(".title")).nativeElement.textContent
    expect(title).toBe("1")

    let subtitle = fixture.debugElement.query(By.css(".subtitle")).nativeElement.textContent
    expect(subtitle).toBe("label")
  })
});
