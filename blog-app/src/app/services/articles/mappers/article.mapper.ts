import { ArticleModel } from '../../../models/article.model';
import { environment } from '../../../../environments/environment.prod';

export class ArticleMapper {
  static fromBackend(backend: any): ArticleModel {
    let imgUrl = backend.imgSrc || 'assets/img/begin.jpeg';
    if (environment.useBackend && imgUrl.startsWith('/uploads')) {
      imgUrl = environment.apiBaseUrl + imgUrl;
    }
    return {
      id: backend.id,
      heading: backend.title,
      content: backend.content,
      dateTime: backend.createdAt,
      img: imgUrl,
      rating: backend.rating ?? 0,
    };
  }

  static toBackend(article: ArticleModel | Omit<ArticleModel, 'id'>): any {
    return {
      title: article.heading,
      content: article.content,
    };
  }

  static paginatedFromBackend(data: any): { items: ArticleModel[]; totalCount: number } {
    const items = (data.items || []).map((item: any) => this.fromBackend(item));
    return { items, totalCount: data.total ?? items.length };
  }
}
