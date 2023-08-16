import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalizacionComponent } from './personalizacion.component';

describe('PersonalizacionComponent', () => {
  let component: PersonalizacionComponent;
  let fixture: ComponentFixture<PersonalizacionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PersonalizacionComponent]
    });
    fixture = TestBed.createComponent(PersonalizacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
