import { Component, inject } from '@angular/core';
import { ArticleModel } from '../../../models/article.model'
import { ArticlesService } from '../../../services/articles.service'
import { ArticleCard } from '../../components/article-card/article-card'

@Component({
  selector: 'app-main-blog-page',
  imports: [ArticleCard],
  templateUrl: './main-blog-page.html',
  styleUrl: './main-blog-page.scss',
})
export class MainBlogPage {
  private articlesService = inject(ArticlesService);
  articles: ArticleModel[] = [];

  ngOnInit(): void {
    this.loadArticles();
  }

  loadArticles(): void {
    this.articles = this.articlesService.getArticles();
  }
  deleteArticle(id: string): void {
    this.articlesService.deleteArticle(id);
    this.loadArticles();
  }
}
