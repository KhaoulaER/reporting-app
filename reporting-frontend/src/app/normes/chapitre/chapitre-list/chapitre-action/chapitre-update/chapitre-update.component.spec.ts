import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChapitreUpdateComponent } from './chapitre-update.component';

describe('ChapitreUpdateComponent', () => {
  let component: ChapitreUpdateComponent;
  let fixture: ComponentFixture<ChapitreUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChapitreUpdateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChapitreUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
