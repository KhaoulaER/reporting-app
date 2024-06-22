import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PointsControleAddComponent } from './points-controle-add.component';

describe('PointsControleAddComponent', () => {
  let component: PointsControleAddComponent;
  let fixture: ComponentFixture<PointsControleAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PointsControleAddComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PointsControleAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
