import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageUploadComponent } from './message-upload.component';

describe('MessageUploadComponent', () => {
  let component: MessageUploadComponent;
  let fixture: ComponentFixture<MessageUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessageUploadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MessageUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
