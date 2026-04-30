import { Component, inject, signal } from '@angular/core';
import { Header } from './ui/components/header/header';
import { Footer } from './ui/components/footer/footer';
import { RouterOutlet } from '@angular/router';

import { ArticlesStoreService } from './services/articles/articles-store.service';
import { ARTICLES_DATA_SERVICE } from './services/articles/articles-data.token';
import { IArticlesDataService } from './services/articles/articles-data.interface';

@Component({
  selector: 'app-root',
  imports: [Header, Footer, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  standalone: true,
})

export class App {
  protected readonly title = signal('blog-app');

  private store = inject(ArticlesStoreService);
  private dataService = inject(ARTICLES_DATA_SERVICE) as IArticlesDataService;

  ngOnInit(): void {
    if (this.store.articles$.getValue().length === 0) {
      this.dataService.getArticles(1, 999).subscribe((result) => {
        this.store.setArticles(result.items);
      });
    }
  }
}
