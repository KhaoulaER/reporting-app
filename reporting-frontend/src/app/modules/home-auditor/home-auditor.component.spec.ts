import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeAuditorComponent } from './home-auditor.component';

describe('HomeAuditorComponent', () => {
  let component: HomeAuditorComponent;
  let fixture: ComponentFixture<HomeAuditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HomeAuditorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HomeAuditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
