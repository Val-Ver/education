import { Component, ChangeDetectorRef, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';

import { ArticleModel } from '../../../models/article.model'

import { ArticlesStoreService } from '../../../services/articles/articles-store.service';
import { ARTICLES_DATA_SERVICE } from '../../../services/articles/articles-data.token';
import { IArticlesDataService } from '../../../services/articles/articles-data.interface';

import { ArticleCard } from '../../components/article-card/article-card'
import { Form } from '../../components/form/form';
import { AdminPanel } from '../../components/admin-panel/admin-panel';
import { ModalDialog } from '../../components/modal-dialog/modal-dialog';
import { AuthorBlog } from '../../components/author-blog/author-blog';

@Component({
  selector: 'app-main-blog-page',
  imports: [ArticleCard, Form, AdminPanel, ModalDialog, AuthorBlog],
  templateUrl: './main-blog-page.html',
  styleUrls: ['../page-common.scss', './main-blog-page.scss'],
  standalone: true,
})
export class MainBlogPage {
  private store = inject(ArticlesStoreService);
  private destroyRef = inject(DestroyRef); // ← для автоматической отписки

  allArticles: ArticleModel[] = [];
  displayedArticles: ArticleModel[] = [];

  private dataService = inject(ARTICLES_DATA_SERVICE) as IArticlesDataService;

  currentPage = 1;
  itemsPerPage = this.store.itemsPerPage; // 7
  totalPages = 0;

  isFormVisible = false;
  isStatsModalVisible = false;
  editingArticle: ArticleModel | null = null;

  private articles$ = toObservable(this.store.articles);
  private cdr = inject(ChangeDetectorRef);

  someAsyncMethod() {
    this.dataService.getArticles(1, 999).subscribe(result => {
      this.store.setArticles(result.items);
      this.cdr.detectChanges();
    });
  }

  ngOnInit(): void {
    this.articles$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((articles) => {
      this.allArticles = articles;
      this.updatePagination();
      this.cdr.detectChanges();
    });

  }

  private updatePagination(): void {
    const total = this.allArticles.length;
    this.totalPages = Math.ceil(total / this.itemsPerPage);

    if (this.currentPage > this.totalPages && this.totalPages > 0) {
      this.currentPage = this.totalPages;
    } else if (this.totalPages === 0) {
      this.currentPage = 1;
    }
    const start = (this.currentPage - 1) * this.itemsPerPage;
    this.displayedArticles = this.allArticles.slice(start, start + this.itemsPerPage);
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updatePagination();
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

    this.goToLastPage();
  }

  goToLastPage(): void {
    if (this.totalPages > 0) {
      this.currentPage = this.totalPages;
      this.updatePagination();
    }
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
