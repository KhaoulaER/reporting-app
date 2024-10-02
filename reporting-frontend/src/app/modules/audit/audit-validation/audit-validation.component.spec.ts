import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditValidationComponent } from './audit-validation.component';

describe('AuditValidationComponent', () => {
  let component: AuditValidationComponent;
  let fixture: ComponentFixture<AuditValidationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AuditValidationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AuditValidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
