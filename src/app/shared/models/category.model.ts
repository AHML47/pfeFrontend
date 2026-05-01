export interface Category {
  id: number;
  nom: string;
  description?: string;
  parentId?: number | null;
}
export interface CategoryFormData {
  nom: string;
  description?: string;
  parentId?: number | null;
}