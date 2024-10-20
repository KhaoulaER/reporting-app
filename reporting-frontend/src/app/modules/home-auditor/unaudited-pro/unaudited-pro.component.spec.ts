import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnauditedProComponent } from './unaudited-pro.component';

describe('UnauditedProComponent', () => {
  let component: UnauditedProComponent;
  let fixture: ComponentFixture<UnauditedProComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UnauditedProComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UnauditedProComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
