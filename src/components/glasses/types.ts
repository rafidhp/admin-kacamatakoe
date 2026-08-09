export interface FormType {
  id: string;
  categoryId: string | null;
  promoId: string | null;
  name: string;
  description: string | null;
  productType: 'glasses' | 'other';
  glassesCode: string | null;
}