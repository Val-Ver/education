import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ArticleModel } from '../../../models/article.model'
import { ArticlesService } from '../../../services/articles.service'
import { ArticleCard } from '../../components/article-card/article-card'

@Component({
  selector: 'app-main-first-page',
  imports: [RouterLink, ArticleCard],
  templateUrl: './main-first-page.html',
  styleUrl: './main-first-page.scss',
})
export class MainFirstPage {
  private articlesService = inject(ArticlesService);
  previewArticles: ArticleModel[] = [];

  ngOnInit(): void {
    const articlesAll = this.articlesService.getArticles();
    this.previewArticles = articlesAll.slice(-3).reverse();
  }
}
