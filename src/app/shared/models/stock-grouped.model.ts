export interface StockGrouped {
  achatLotId: number;
  numeroLot: string;
  nomProduit: string;
  fournisseur: string;
  dateAchat: string;

  totalQuantity: number;
    transactions?: any[];
}