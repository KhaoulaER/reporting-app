import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChapitreDetailsComponent } from './chapitre-details.component';

describe('ChapitreDetailsComponent', () => {
  let component: ChapitreDetailsComponent;
  let fixture: ComponentFixture<ChapitreDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChapitreDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChapitreDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
