export enum OrderStatus {
  EnAttente = 'EnAttente',
  Confirmee = 'Confirmee',
  Livree = 'Livree',
  Annulee = 'Annulee'
}

export interface Order {
  id: number;
  userId: number;

  // 👇 pour afficher nom user (optionnel backend)
  user?: {
    nom: string;
    prenom: string;
  };

  dateCommande: string;

  totalProduits: number;
  fraisLivraison: number;
  totalFinal: number;

  statut: OrderStatus;

  orderDetails: OrderDetail[];
}

export interface OrderDetail {
  produitId: number;
  quantite: number;
  prixUnitaire: number;

  produit?: {
    nom: string;
    image?: string;
  };
}