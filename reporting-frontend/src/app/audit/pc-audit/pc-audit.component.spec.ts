import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PcAuditComponent } from './pc-audit.component';

describe('PcAuditComponent', () => {
  let component: PcAuditComponent;
  let fixture: ComponentFixture<PcAuditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PcAuditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PcAuditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
