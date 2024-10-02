import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AffectationAddComponent } from './affectation-add.component';

describe('AffectationAddComponent', () => {
  let component: AffectationAddComponent;
  let fixture: ComponentFixture<AffectationAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AffectationAddComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AffectationAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
