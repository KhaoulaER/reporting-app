import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreuveAddComponent } from './preuve-add.component';

describe('PreuveAddComponent', () => {
  let component: PreuveAddComponent;
  let fixture: ComponentFixture<PreuveAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PreuveAddComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PreuveAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
