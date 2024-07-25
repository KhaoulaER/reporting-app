import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjetAuditComponent } from './projet-audit.component';

describe('ProjetAuditComponent', () => {
  let component: ProjetAuditComponent;
  let fixture: ComponentFixture<ProjetAuditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProjetAuditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProjetAuditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
