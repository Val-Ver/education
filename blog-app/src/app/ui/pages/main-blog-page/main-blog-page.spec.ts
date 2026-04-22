import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainBlogPage } from './main-blog-page';

describe('MainBlogPage', () => {
  let component: MainBlogPage;
  let fixture: ComponentFixture<MainBlogPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainBlogPage],
    }).compileComponents();

    fixture = TestBed.createComponent(MainBlogPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
