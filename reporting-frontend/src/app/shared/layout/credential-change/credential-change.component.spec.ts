import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CredentialChangeComponent } from './credential-change.component';

describe('CredentialChangeComponent', () => {
  let component: CredentialChangeComponent;
  let fixture: ComponentFixture<CredentialChangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CredentialChangeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CredentialChangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
