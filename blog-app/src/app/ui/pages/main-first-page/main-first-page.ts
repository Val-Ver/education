import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ArticleModel } from '../../../models/article.model'
import { ArticlesStoreService } from '../../../services/articles/articles-store.service';
// import { ARTICLES_DATA_SERVICE } from '../../../services/articles/articles-data.token';
// import { IArticlesDataService } from '../../../services/articles/articles-data.interface';
import { Subscription } from 'rxjs';
// import { ArticlesService } from '../../../services/articles.service'
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
  // private dataService = inject(ARTICLES_DATA_SERVICE) as IArticlesDataService;
  private subscription: Subscription | null = null;

  // private articlesService = inject(ArticlesService);
  previewArticles: ArticleModel[] = [];

  ngOnInit(): void {
    this.subscription = this.store.articles$.subscribe((articles) => {
      // if (articles.length === 0) {
      //   this.loadArticles();
      // } else {
        this.previewArticles = articles.slice(-2).reverse();
      // }
    });
  }
  // private loadArticles(): void {
  //   this.dataService.getArticles(1, 999).subscribe((result) => {
  //     this.store.setArticles(result.items);
  //   });
  // }
  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
