import { CategoryModel } from '../../../models/category.model';

export interface BackendArticle {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  imgSrc: string | null;
  rating: number;
  categoryId?: string;
  category?: CategoryModel;
}
