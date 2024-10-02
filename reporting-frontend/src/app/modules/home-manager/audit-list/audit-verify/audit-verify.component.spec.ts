import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditVerifyComponent } from './audit-verify.component';

describe('AuditVerifyComponent', () => {
  let component: AuditVerifyComponent;
  let fixture: ComponentFixture<AuditVerifyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AuditVerifyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AuditVerifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
