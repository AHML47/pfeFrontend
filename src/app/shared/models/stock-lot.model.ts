export interface StockLotDetail {
  id: number;
  quantiteRestante: number;
  dateReception: string;
}

export interface AchatLotResponse {
  id: number;
  produitId: number;
  produit: {
    id: number;
    nom: string;
    stockDisponible: number;
  };
  dateAchat: string;
  quantiteAchetee: number;
  prixUnitaire: number;
  fournisseur: string;
  numeroLot: string;
  stockLots: StockLotDetail[];
}