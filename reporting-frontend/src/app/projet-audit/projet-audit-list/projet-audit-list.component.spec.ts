import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjetAuditListComponent } from './projet-audit-list.component';

describe('ProjetAuditListComponent', () => {
  let component: ProjetAuditListComponent;
  let fixture: ComponentFixture<ProjetAuditListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProjetAuditListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProjetAuditListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
