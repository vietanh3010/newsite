import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestingpageComponent } from './testingpage.component';

describe('TestingpageComponent', () => {
  let component: TestingpageComponent;
  let fixture: ComponentFixture<TestingpageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestingpageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestingpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
