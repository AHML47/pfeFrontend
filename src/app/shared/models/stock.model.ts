// Correspond exactement à StockLot.cs + AchatLot.cs + Produit
export interface StockLot {
  id: number;
  achatLotId: number;
  quantiteRestante: number;
  dateReception: string;
  achatLot: {
    id: number;
    produitId: number;
    quantiteAchetee: number;
    prixUnitaire: number;
    fournisseur: string;
    numeroLot: string;
    dateAchat: string;
    produit: {
      id: number;
      nom: string;
    };
  };
}

// Statut calculé côté Angular
export type StatutLot = 'ok' | 'faible' | 'vide';

export function getStatutLot(lot: StockLot): StatutLot {
  const restante  = lot.quantiteRestante;
  const initiale  = lot.achatLot?.quantiteAchetee ?? 0;

  if (restante === 0)                    return 'vide';
  if (restante <= initiale * 0.2)        return 'faible';
  return 'ok';
}

export function pourcentage(lot: StockLot): number {
  const initiale = lot.achatLot?.quantiteAchetee ?? 0;
  if (!initiale) return 0;
  return Math.round((lot.quantiteRestante / initiale) * 100);
}