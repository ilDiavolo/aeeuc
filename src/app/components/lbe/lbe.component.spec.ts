import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LbeComponent } from './lbe.component';

describe('LbeComponent', () => {
  let component: LbeComponent;
  let fixture: ComponentFixture<LbeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LbeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LbeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
