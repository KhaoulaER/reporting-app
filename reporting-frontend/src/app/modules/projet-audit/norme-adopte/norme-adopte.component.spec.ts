import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NormeAdopteComponent } from './norme-adopte.component';

describe('NormeAdopteComponent', () => {
  let component: NormeAdopteComponent;
  let fixture: ComponentFixture<NormeAdopteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NormeAdopteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NormeAdopteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
