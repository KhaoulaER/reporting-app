import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NormeListComponent } from './norme-list.component';

describe('NormeListComponent', () => {
  let component: NormeListComponent;
  let fixture: ComponentFixture<NormeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NormeListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NormeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
