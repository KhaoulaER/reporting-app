import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreuveListComponent } from './preuve-list.component';

describe('PreuveListComponent', () => {
  let component: PreuveListComponent;
  let fixture: ComponentFixture<PreuveListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PreuveListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PreuveListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
