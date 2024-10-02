import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NormeAdopteListComponent } from './norme-adopte-list.component';

describe('NormeAdopteListComponent', () => {
  let component: NormeAdopteListComponent;
  let fixture: ComponentFixture<NormeAdopteListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NormeAdopteListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NormeAdopteListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
