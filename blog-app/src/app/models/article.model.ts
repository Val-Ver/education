export interface ArticleModel {
  id: string;
  heading: string;
  content: string;
  dateTime: string;
  img: string;
  rating: number;
  categoryId?: string;
  categoryName?: string;
}
