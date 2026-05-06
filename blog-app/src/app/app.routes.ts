import { Routes } from '@angular/router';
import { MainFirstPage} from './ui/pages/main-first-page/main-first-page';
import { MainBlogPage } from './ui/pages/main-blog-page/main-blog-page';
import { PostPage } from './ui/pages/post-page/post-page';

export const routes: Routes = [
  { path: '', component: MainFirstPage },
  { path: 'blog', component: MainBlogPage },
  { path: 'post/:id', component: PostPage },
  { path: '**', redirectTo: '' },
];
