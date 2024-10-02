import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChapitreListComponent } from './chapitre-list.component';

describe('ChapitreListComponent', () => {
  let component: ChapitreListComponent;
  let fixture: ComponentFixture<ChapitreListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChapitreListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChapitreListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
