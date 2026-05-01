export interface Product {
  id: number;
  nom: string;
  description: string;
  prixAchat: number;   // reçu du backend en GET
  isActive: boolean;
  categorieId: number;
  categorieNom?: string;
}

export interface ProductFormData {
  nom: string;
  description: string;
  prix: number;        // envoyé au backend en POST/PUT
  categorieId: number;
}