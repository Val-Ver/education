import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainFirstPage } from './main-first-page';

describe('MainFirstPage', () => {
  let component: MainFirstPage;
  let fixture: ComponentFixture<MainFirstPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainFirstPage],
    }).compileComponents();

    fixture = TestBed.createComponent(MainFirstPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
