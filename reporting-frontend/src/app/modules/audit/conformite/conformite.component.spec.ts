import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConformiteComponent } from './conformite.component';

describe('ConformiteComponent', () => {
  let component: ConformiteComponent;
  let fixture: ComponentFixture<ConformiteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConformiteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConformiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
