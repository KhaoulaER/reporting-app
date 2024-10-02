import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreuveAuditComponent } from './preuve-audit.component';

describe('PreuveAuditComponent', () => {
  let component: PreuveAuditComponent;
  let fixture: ComponentFixture<PreuveAuditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PreuveAuditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PreuveAuditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
