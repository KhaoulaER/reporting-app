import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientsAddComponent } from './clients-add.component';

describe('ClientsAddComponent', () => {
  let component: ClientsAddComponent;
  let fixture: ComponentFixture<ClientsAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ClientsAddComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClientsAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
