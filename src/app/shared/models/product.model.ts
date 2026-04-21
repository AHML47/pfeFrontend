export type ProductType = 'fixe' | 'libre';

export interface Product {
  id: number;

  nom: string;
  description: string;

  prixVente: number;
  prixAchat: number;

  categorieId: number;
  categorieNom?: string;

  isActive: boolean;

  stockActuel: number;
  minimumStock: number;

  // ✅ NOUVEAU : Type de produit
  type: ProductType;

  // ✅ NOUVEAU : Pourcentage (pour type 'libre')
  pourcentage?: number;
}

// utilisé pour add / update API
export interface ProductFormData {
  nom: string;
  description: string;

  prixVente: number;
  prixAchat: number;

  categorieId: number;

  isActive: boolean;
  stockActuel: number;
  minimumStock: number;

  // ✅ NOUVEAU : Type de produit
  type: ProductType;

  // ✅ NOUVEAU : Pourcentage (pour type 'libre')
  pourcentage?: number;
}

// Pour les réponses d'API
export interface ProductResponse {
  success: boolean;
  data: Product;
  message?: string;
}

// Pour les listes
export interface ProductListResponse {
  success: boolean;
  data: Product[];
  total: number;
}