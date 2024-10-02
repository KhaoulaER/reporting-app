import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PointsControleUpdateComponent } from './points-controle-update.component';

describe('PointsControleUpdateComponent', () => {
  let component: PointsControleUpdateComponent;
  let fixture: ComponentFixture<PointsControleUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PointsControleUpdateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PointsControleUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
