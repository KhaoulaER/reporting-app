import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NormeUpdateComponent } from './norme-update.component';

describe('NormeUpdateComponent', () => {
  let component: NormeUpdateComponent;
  let fixture: ComponentFixture<NormeUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NormeUpdateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NormeUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
