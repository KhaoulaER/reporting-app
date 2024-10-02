import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreuveComponent } from './preuve.component';

describe('PreuveComponent', () => {
  let component: PreuveComponent;
  let fixture: ComponentFixture<PreuveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PreuveComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PreuveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
