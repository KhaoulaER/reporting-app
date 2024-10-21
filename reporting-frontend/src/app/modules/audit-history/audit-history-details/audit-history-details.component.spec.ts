import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditHistoryDetailsComponent } from './audit-history-details.component';

describe('AuditHistoryDetailsComponent', () => {
  let component: AuditHistoryDetailsComponent;
  let fixture: ComponentFixture<AuditHistoryDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AuditHistoryDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AuditHistoryDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
