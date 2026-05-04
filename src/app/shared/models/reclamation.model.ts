export type ReclamationStatus = 'En attente' | 'En cours' | 'Résolue' | 'Rejetée';

export type ReclamationType =
  | 'Produit manquant'
  | 'Mauvais produit reçu'
  | 'Quantité incorrecte'
  | 'Produit endommagé'
  | 'Retard de livraison'
  | 'Autre problème';

export interface Reclamation {
  id: number;
  orderId: number;
  sujet: ReclamationType;
  description: string;
  status: ReclamationStatus;
  reponseAdmin?: string;
  dateCreation: string;
  dateResolution?: string;
  userId: string;
}

export interface CreateReclamationDto {
  orderId: number;
  sujet: ReclamationType;
  description: string;
}

export interface TraiterReclamationDto {
  status: ReclamationStatus;
  reponseAdmin: string;
}