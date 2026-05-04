export interface CreateAchatLotDto {
  produitId: number;
  quantiteAchetee: number;
  prixUnitaire: number;
  fournisseur?: string;
  numeroLot?: string;
  datePeremption?: string | null;
}