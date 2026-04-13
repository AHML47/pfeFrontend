
export interface Stock {
  id: string;
  productId: string;
  productName: string;
  quantity: number; 
  lastRestockDate: Date;
  lastRestockQuantity: number;
}

export interface StockBatch {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  purchasePrice: number; 
  totalCost: number; 
  batchDate: Date;
  supplier: string;
  notes: string;
}


export interface StockAlert {
  id: string;
  productId: string;
  productName: string;
  currentStock: number;
  minimumStock: number;
  severity: 'critical' | 'warning'; 
  createdAt: Date;
  resolved: boolean;
}


export interface StockMovement {
  id: string;
  productId: string;
  productName: string;
  type: 'in' | 'out' | 'adjustment'; 
  quantity: number;
  reason: string; 
  date: Date;
}
