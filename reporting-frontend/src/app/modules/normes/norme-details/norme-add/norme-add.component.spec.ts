import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NormeAddComponent } from './norme-add.component';

describe('NormeAddComponent', () => {
  let component: NormeAddComponent;
  let fixture: ComponentFixture<NormeAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NormeAddComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NormeAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
