import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PointsControleComponent } from './points-controle.component';

describe('PointsControleComponent', () => {
  let component: PointsControleComponent;
  let fixture: ComponentFixture<PointsControleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PointsControleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PointsControleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
