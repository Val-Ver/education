import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { ArticleModel } from '../../../models/article.model'
import { ArticlesService } from '../../../services/articles.service'
import { ArticleCard } from '../../components/article-card/article-card'
import { Form } from '../../components/form/form';

@Component({
  selector: 'app-main-blog-page',
  imports: [ArticleCard, Form],
  templateUrl: './main-blog-page.html',
  styleUrls: ['../page-common.scss', './main-blog-page.scss'],
  standalone: true,
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

  isFormVisible = false;

  showForm() {
    this.isFormVisible = true;
  }

  hideForm(): void {
    this.isFormVisible = false;
    this.loadArticles(); // перезагружаем список, чтобы новая статья появилась
  }
}
