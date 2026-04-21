export type OrderStatus = 'EnAttente' | 'Validee' | 'Livree' | 'Annulee';

export interface Order {
  id: number;

  statut: OrderStatus;

  createdAt: Date;
  dateCommande?: Date;

  userId?: number;
  userName?: string;

  totalPrice?: number;
  totalProduits?: number;
  fraisLivraison?: number;
  totalFinal?: number;

  orderDetails: OrderDetail[];
}

export interface OrderDetail {
  productId: number;
  productName?: string;

  quantity: number;
  prixUnitaire: number;
  price?: number;

  produit?: {
    nom: string;
    image?: string;
  };
}