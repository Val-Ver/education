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
  profileUrl = 'assets/img/profile.jpeg';
  magicUrl = 'assets/img/magic.jpeg';
  awordsUrl = 'assets/img/awords.jpeg';
  fishUrl = 'assets/img/fish.jpeg';
  horseUrl = 'assets/img/horse.jpeg';

  private articlesService = inject(ArticlesService);
  previewArticles: ArticleModel[] = [];

  ngOnInit(): void {
    const articlesAll = this.articlesService.getArticles();
    if (articlesAll.length !== 0) {
      this.previewArticles = articlesAll.slice(-3).reverse();
    }
  }
}
