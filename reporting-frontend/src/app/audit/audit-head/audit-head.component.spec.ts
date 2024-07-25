import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditHeadComponent } from './audit-head.component';

describe('AuditHeadComponent', () => {
  let component: AuditHeadComponent;
  let fixture: ComponentFixture<AuditHeadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AuditHeadComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AuditHeadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
