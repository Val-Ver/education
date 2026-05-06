import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorBlog } from './author-blog';

describe('AuthorBlog', () => {
  let component: AuthorBlog;
  let fixture: ComponentFixture<AuthorBlog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthorBlog],
    }).compileComponents();

    fixture = TestBed.createComponent(AuthorBlog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
