import { ArticleModel } from '../../../models/article.model';
import { environment } from '../../../../environments/environment.prod';

import { BackendArticle } from '../types/backend-article.interface';
import {BackendPaginatedResult} from '../types/backend-paginated.interface';

export class ArticleMapper {
  static fromBackend(backend: BackendArticle): ArticleModel {
    let imgUrl = backend.imgSrc || 'assets/img/begin.jpeg';
    if (environment.useBackend && imgUrl.startsWith('/uploads')) {
      imgUrl = environment.apiBaseUrl + imgUrl;
    }
    return {
      id: backend.id,
      heading: backend.title,
      content: backend.content,
      dateTime: backend.createdAt,
      img: backend.imgSrc || 'assets/img/begin.jpeg',
      rating: backend.rating ?? 0,
      categoryId: backend.categoryId,
      categoryName: backend.category?.name,
    };
  }

  static toBackend(article: ArticleModel | Omit<ArticleModel, 'id'>): any {
    return {
      title: article.heading,
      content: article.content,
    };
  }

  static paginatedFromBackend(data: BackendPaginatedResult): {
    items: ArticleModel[];
    totalCount: number;
  } {
    const items = data.items.map((item) => this.fromBackend(item));
    return { items, totalCount: data.total };
  }
}
