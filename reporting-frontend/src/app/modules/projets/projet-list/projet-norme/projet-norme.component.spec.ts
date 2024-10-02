import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjetNormeComponent } from './projet-norme.component';

describe('ProjetNormeComponent', () => {
  let component: ProjetNormeComponent;
  let fixture: ComponentFixture<ProjetNormeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProjetNormeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProjetNormeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
