import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChapitreAddComponent } from './chapitre-add.component';

describe('ChapitreAddComponent', () => {
  let component: ChapitreAddComponent;
  let fixture: ComponentFixture<ChapitreAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChapitreAddComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChapitreAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
