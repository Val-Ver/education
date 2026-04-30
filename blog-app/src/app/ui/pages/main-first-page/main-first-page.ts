import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ArticleModel } from '../../../models/article.model'
import { ArticlesStoreService } from '../../../services/articles/articles-store.service';
import { Subscription } from 'rxjs';

import { ArticleCard } from '../../components/article-card/article-card'

@Component({
  selector: 'app-main-first-page',
  imports: [RouterLink, ArticleCard],
  templateUrl: './main-first-page.html',
  styleUrls: ['../page-common.scss', './main-first-page.scss'],
})
export class MainFirstPage {
  profileUrl = 'assets/img/profile.jpeg';
  magicUrl = 'assets/img/magic.jpeg';
  awordsUrl = 'assets/img/awords.jpeg';
  fishUrl = 'assets/img/fish.jpeg';
  horseUrl = 'assets/img/horse.jpeg';

  private store = inject(ArticlesStoreService);
  private subscription: Subscription | null = null;

  previewArticles: ArticleModel[] = [];

  ngOnInit(): void {
    this.subscription = this.store.articles$.subscribe((articles) => {
      this .previewArticles = articles.slice(-2).reverse();
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
