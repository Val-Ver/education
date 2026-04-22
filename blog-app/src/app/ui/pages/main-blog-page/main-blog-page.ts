import {
  Component,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { ArticleModel } from '../../../models/article.model'
import { ArticlesService } from '../../../services/articles.service'
import { ArticleCard } from '../../components/article-card/article-card'
import { Form } from '../../components/form/form';
import { AdminPanel } from '../../components/admin-panel/admin-panel';
import { ModalDialog } from '../../components/modal-dialog/modal-dialog';

@Component({
  selector: 'app-main-blog-page',
  imports: [ArticleCard, Form, AdminPanel, ModalDialog],
  templateUrl: './main-blog-page.html',
  styleUrls: ['../page-common.scss', './main-blog-page.scss'],
  standalone: true,
})
export class MainBlogPage {
  private articlesService = inject(ArticlesService);
  articles: ArticleModel[] = [];

  isFormVisible = false;
  isStatsModalVisible = false;
  statsArticlesCount = 0;
  // private modalDialog: any;


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

  showForm() {
    this.isFormVisible = true;
  }

  hideForm(): void {
    this.isFormVisible = false;
    this.loadArticles();
  }

  showModal() {
    this.statsArticlesCount = this.articles.length;
    this.isStatsModalVisible = true;

  }

  closeStatsModal(): void {
    this.isStatsModalVisible = false;

  }
}
