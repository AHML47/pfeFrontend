export type OrderStatus =
  'EnAttente' |
  'Confirmee' |
  'Livree' |
  'Annulee';

export interface Order {
  id: number;

  userId: number;

  dateCommande: string;

  totalProduits: number;
  fraisLivraison: number;

  statut: OrderStatus;

  orderDetails: OrderDetail[];
}

export interface OrderDetail {
  produitId: number;
  quantite: number;
  prixUnitaire: number;

  produit?: {
    nom: string;
  };
}