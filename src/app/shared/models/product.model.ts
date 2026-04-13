
export interface Product {
  id: string;
  name: string;
  description: string;
  sku: string; 
  price: number; 
  category: string;
  image: string;
  active: boolean; 
  createdAt: Date;
  updatedAt: Date;
  minimumStock: number; 
}

export interface ProductFormData {
  name: string;
  description: string;
  sku: string;
  price: number;
  category: string;
  image: string;
  minimumStock: number;
}
