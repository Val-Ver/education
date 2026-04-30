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

import { ArticlesStoreService } from '../../../services/articles/articles-store.service';
import { ARTICLES_DATA_SERVICE } from '../../../services/articles/articles-data.token';
import { IArticlesDataService } from '../../../services/articles/articles-data.interface';

import { ArticleCard } from '../../components/article-card/article-card'
import { Form } from '../../components/form/form';
import { AdminPanel } from '../../components/admin-panel/admin-panel';
import { ModalDialog } from '../../components/modal-dialog/modal-dialog';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-main-blog-page',
  imports: [ArticleCard, Form, AdminPanel, ModalDialog],
  templateUrl: './main-blog-page.html',
  styleUrls: ['../page-common.scss', './main-blog-page.scss'],
  standalone: true,
})
export class MainBlogPage {
  private dataService = inject(ARTICLES_DATA_SERVICE) as IArticlesDataService;
  private store = inject(ArticlesStoreService);

  displayedArticles: ArticleModel[] = [];
  allArticles: ArticleModel[] = [];

  currentPage = 1;
  itemsPerPage = this.store.itemsPerPage; // 7
  totalPages = 0;

  isFormVisible = false;
  isStatsModalVisible = false;
  editingArticle: ArticleModel | null = null;

  private subscription: Subscription | null = null;

  ngOnInit(): void {
    this.subscription = this.store.articles$.subscribe((articles) => {
      this.allArticles = articles;
      this.updatePagination();
    });
  }

  private updatePagination(): void {
    const total = this.allArticles.length;
    this.totalPages = Math.ceil(total / this.itemsPerPage);

    if (this.currentPage > this.totalPages && this.totalPages > 0) {
      this.currentPage = this.totalPages;
    }
    const start = (this.currentPage - 1) * this.itemsPerPage;
    this.displayedArticles = this.allArticles.slice(start, start + this.itemsPerPage);
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updatePagination();
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  deleteArticle(id: string): void {
    if (this.editingArticle?.id === id) {
      this.hideForm();
    }
    this.dataService.deleteArticle(id).subscribe((updatedArticles) => {
      this.store.setArticles(updatedArticles);
      this.updatePagination();
    });
  }

  showForm() {
    this.editingArticle = null;
    this.isFormVisible = true;
  }

  hideForm(): void {
    this.isFormVisible = false;
    this.editingArticle = null;
  }

  editArticle(id: string) {
    const article = this.allArticles.find((a) => a.id === id);
    if (article) {
      this.editingArticle = { ...article };
      this.isFormVisible = true;
    }
  }

  showModal() {
    this.isStatsModalVisible = true;
  }

  closeStatsModal(): void {
    this.isStatsModalVisible = false;
  }

  get statsArticlesCount(): number {
    return this.allArticles.length;
  }
}
