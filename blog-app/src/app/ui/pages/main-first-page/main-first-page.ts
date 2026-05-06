import { Component, inject, DestroyRef } from '@angular/core';
import { RouterLink } from '@angular/router';

import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';

import { ArticleModel } from '../../../models/article.model'
import { ArticlesStoreService } from '../../../services/articles/articles-store.service';

import { ArticleCard } from '../../components/article-card/article-card'
import { AuthorInfo } from '../../components/author-info/author-info';
import { WorkExperience } from '../../components/work-experience/work-experience';
import { Achievements } from '../../components/achievements/achievements';
import { Hobby } from '../../components/hobby/hobby';

@Component({
  selector: 'app-main-first-page',
  imports: [RouterLink, ArticleCard, AuthorInfo, WorkExperience, Achievements, Hobby],
  templateUrl: './main-first-page.html',
  styleUrls: ['../page-common.scss', './main-first-page.scss'],
  standalone: true,
})
export class MainFirstPage {
  private store = inject(ArticlesStoreService);
  private destroyRef = inject(DestroyRef);

  previewArticles: ArticleModel[] = [];
  private articles$ = toObservable(this.store.articles);

  ngOnInit(): void {
    this.articles$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((articles) => {
        this.previewArticles = articles.slice(-2).reverse();
    });
  }
}
