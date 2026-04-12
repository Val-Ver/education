import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { FirstPage } from './first-page/first-page';
import { Header } from './ui/components/header/header';
import { PageContainer } from './ui/components/page-container/page-container';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, PageContainer],
  templateUrl: './app.html',
  styleUrl: './app-global.scss'
})
export class App {
  protected readonly title = signal('blog-app');
}
