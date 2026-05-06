import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkExperience } from './work-experience';

describe('WorkExperience', () => {
  let component: WorkExperience;
  let fixture: ComponentFixture<WorkExperience>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkExperience],
    }).compileComponents();

    fixture = TestBed.createComponent(WorkExperience);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
