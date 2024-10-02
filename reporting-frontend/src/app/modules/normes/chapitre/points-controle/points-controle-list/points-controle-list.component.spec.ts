import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PointsControleListComponent } from './points-controle-list.component';

describe('PointsControleListComponent', () => {
  let component: PointsControleListComponent;
  let fixture: ComponentFixture<PointsControleListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PointsControleListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PointsControleListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
