import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RapportXlsxComponent } from './rapport-xlsx.component';

describe('RapportXlsxComponent', () => {
  let component: RapportXlsxComponent;
  let fixture: ComponentFixture<RapportXlsxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RapportXlsxComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RapportXlsxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
