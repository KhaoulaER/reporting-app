import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjetAddComponent } from './projet-add.component';

describe('ProjetAddComponent', () => {
  let component: ProjetAddComponent;
  let fixture: ComponentFixture<ProjetAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProjetAddComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProjetAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
