import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ArticleModel } from '../../../models/article.model'
import { ArticlesStoreService } from '../../../services/articles/articles-store.service';
import { Subscription } from 'rxjs';

import { ArticleCard } from '../../components/article-card/article-card'
import {AuthorInfo} from '../../components/author-info/author-info';
import {WorkExperience} from '../../components/work-experience/work-experience';
import {Achievements} from '../../components/achievements/achievements';
import {Hobby} from '../../components/hobby/hobby';

@Component({
  selector: 'app-main-first-page',
  imports: [RouterLink, ArticleCard, AuthorInfo, WorkExperience, Achievements, Hobby],
  templateUrl: './main-first-page.html',
  styleUrls: ['../page-common.scss', './main-first-page.scss'],
  standalone: true,
})
export class MainFirstPage {
  private store = inject(ArticlesStoreService);
  private subscription: Subscription | null = null;

  previewArticles: ArticleModel[] = [];

  ngOnInit(): void {
    this.subscription = this.store.articles$.subscribe((articles) => {
      this.previewArticles = articles.slice(-2).reverse();
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
