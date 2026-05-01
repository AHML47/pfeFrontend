
// ============================================================
// ENUMS
// ============================================================

export enum TypeMouvement {
  ENTREE = 'ENTREE',
  SORTIE = 'SORTIE',
  AJUSTEMENT = 'AJUSTEMENT'
}

// ============================================================
// ACHAT LOT
// ============================================================

export interface AchatLot {
  id?: string; // ✅ IMPORTANT : optionnel (backend le génère)

  dateAchat: Date;
  quantiteAchetee: number;
  prixAchatUnitaire: number;
  fournisseur: string;
  numeroLot: string;
  produitId: string;
}

// ============================================================
// STOCK LOT
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
// STOCK (agrégé)
// ============================================================

export interface Stock {
  id: string;
  productId: string;
  quantity: number;
  lastUpdated: Date;
  produitId: number;
}

// ============================================================
// STOCK BATCH (optionnel)
// ============================================================

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

// ============================================================
// STOCK MOVEMENT
// ============================================================

export interface StockMovement {
  id: string;
  productId: string;
  type: 'in' | 'out';
  quantity: number;
  reason: string;
  timestamp: Date;
}

// ============================================================
// STOCK ALERT (UNIQUE VERSION)
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
// TRANSACTION
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