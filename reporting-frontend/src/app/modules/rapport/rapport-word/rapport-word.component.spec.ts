import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RapportWordComponent } from './rapport-word.component';

describe('RapportWordComponent', () => {
  let component: RapportWordComponent;
  let fixture: ComponentFixture<RapportWordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RapportWordComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RapportWordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
