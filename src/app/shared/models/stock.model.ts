// stock.model.ts

// ============================================================
// ENUMS
// ============================================================

export enum TypeMouvement {
  ENTREE = 'ENTREE',
  SORTIE = 'SORTIE',
  AJUSTEMENT = 'AJUSTEMENT'
}

// ============================================================
// ACHAT LOT  →  classe "AchatLot" du diagramme
// ============================================================

export interface AchatLot {
  id: string;
  dateAchat: Date;
  quantiteAchetee: number;
  prixAchatUnitaire: number;
  fournisseur: string;
  numeroLot: string;
  produitId: string;
}

// ============================================================
// STOCK LOT  →  classe "Stock Lots" du diagramme
// ============================================================

export interface StockLot {
  id: string;
  produitId: string;
  produitNom: string;
  quantiteRestante: number;
  dateReception: Date;
  achatLot?: AchatLot;
}

// ============================================================
// STOCK  →  vue agrégée par produit
// ============================================================

export interface Stock {
  id: string;
  productId: string;
  quantity: number;
  lastUpdated: Date;
   produitId: number;
}

export interface StockBatch {
  id: string;
  productId: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
  batchDate: Date;
  expirationDate?: Date;
  supplierId: string;
}

export interface StockMovement {
  id: string;
  productId: string;
  type: 'in' | 'out';
  quantity: number;
  reason: string;
  timestamp: Date;
}

export interface StockAlert {
  id: string;
  productId: string;
  productName: string;
  currentStock: number;
  minimumStock: number;
  severity: 'low' | 'critical';
  createdAt: Date;
}

// ============================================================
// STOCK ALERT  →  logique produit.seuilAlerte + alerteStock
// ============================================================

export interface StockAlert {
  id: string;
  productId: string;
  productName: string;
  currentStock: number;
  minimumStock: number;
  severity: 'low' | 'critical';
  createdAt: Date;
}

// ============================================================
// TRANSACTION  →  classe "transactions" du diagramme
// ============================================================

export interface Transaction {
  id: string;
  produitId: string;
  produitNom: string;
  type: TypeMouvement;
  quantite: number;
  dateMouvement: Date;
  achatLotId?: string;
  lotCommandeId?: string;
}