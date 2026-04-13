import { Injectable, Inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Stock, StockBatch, StockAlert, StockMovement } from '../models/stock.model';
import { ProductService } from './product.service';

@Injectable({
  providedIn: 'root'
})
export class StockService {
  private stocks$ = new BehaviorSubject<Stock[]>([]);
  private batches$ = new BehaviorSubject<StockBatch[]>([]);
  private movements$ = new BehaviorSubject<StockMovement[]>([]);
  private alerts$ = new BehaviorSubject<StockAlert[]>([]);
  private isBrowser: boolean;

  public stocks = this.stocks$.asObservable();
  public batches = this.batches$.asObservable();
  public movements = this.movements$.asObservable();
  public alerts = this.alerts$.asObservable();

  constructor(
    private productService: ProductService,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.initializeStocks();
  }

  private initializeStocks() {
    if (!this.isBrowser) return;

    const saved = localStorage.getItem('stocks');
    if (saved) {
      const stocks = JSON.parse(saved);
      this.stocks$.next(stocks);
      this.checkAlerts();
    } else {
      const products = this.productService.getAllProducts();
      const initialStocks: Stock[] = products.map(product => ({
        id: 'STK-' + product.id,
        productId: product.id,
        productName: product.name,
        quantity: 100,
        lastRestockDate: new Date(),
        lastRestockQuantity: 100
      }));
      this.saveStocks(initialStocks);
    }

    const savedMovements = localStorage.getItem('stock_movements');
    if (savedMovements) {
      this.movements$.next(JSON.parse(savedMovements));
    }

    const savedBatches = localStorage.getItem('stock_batches');
    if (savedBatches) {
      this.batches$.next(JSON.parse(savedBatches));
    }
  }

  private saveStocks(stocks: Stock[]) {
    if (this.isBrowser) {
      localStorage.setItem('stocks', JSON.stringify(stocks));
    }
    this.stocks$.next(stocks);
    this.checkAlerts();
  }

  private saveMovements(movements: StockMovement[]) {
    if (this.isBrowser) {
      localStorage.setItem('stock_movements', JSON.stringify(movements));
    }
    this.movements$.next(movements);
  }

  private saveBatches(batches: StockBatch[]) {
    if (this.isBrowser) {
      localStorage.setItem('stock_batches', JSON.stringify(batches));
    }
    this.batches$.next(batches);
  }

  getProductStock(productId: string): Stock | undefined {
    return this.stocks$.value.find(s => s.productId === productId);
  }

  getAllStocks(): Stock[] {
    return this.stocks$.value;
  }

  addStockBatch(batch: Omit<StockBatch, 'id' | 'totalCost'>): StockBatch {
    const batches = this.batches$.value;
    const newBatch: StockBatch = {
      id: 'BATCH-' + Date.now(),
      ...batch,
      totalCost: batch.quantity * batch.purchasePrice,
      batchDate: batch.batchDate || new Date()
    };

    const stocks = this.stocks$.value;
    const stock = stocks.find(s => s.productId === batch.productId);
    if (stock) {
      stock.quantity += batch.quantity;
      stock.lastRestockDate = new Date();
      stock.lastRestockQuantity = batch.quantity;
      this.saveStocks(stocks);
    }

    this.addStockMovement({
      type: 'in',
      productId: batch.productId,
      productName: batch.productName,
      quantity: batch.quantity,
      reason: `Achat du fournisseur ${batch.supplier}`,
      date: new Date()
    });

    batches.push(newBatch);
    this.saveBatches(batches);
    return newBatch;
  }

  addStockMovement(movement: Omit<StockMovement, 'id'>): StockMovement {
    const movements = this.movements$.value;
    const newMovement: StockMovement = {
      id: 'MOV-' + Date.now(),
      ...movement,
      date: movement.date || new Date()
    };
    movements.push(newMovement);
    this.saveMovements(movements);
    return newMovement;
  }

  decrementStock(productId: string, quantity: number, reason: string = 'Vente'): boolean {
    const stocks = this.stocks$.value;
    const stock = stocks.find(s => s.productId === productId);

    if (stock && stock.quantity >= quantity) {
      stock.quantity -= quantity;
      this.saveStocks(stocks);

      const product = this.productService.getProductById(productId);
      this.addStockMovement({
        type: 'out',
        productId,
        productName: product?.name || 'Produit inconnu',
        quantity,
        reason,
        date: new Date()
      });

      this.checkAlerts();
      return true;
    }
    return false;
  }

  private checkAlerts() {
    const products = this.productService.getAllProducts();
    const stocks = this.stocks$.value;
    const alerts: StockAlert[] = [];

    stocks.forEach(stock => {
      const product = products.find(p => p.id === stock.productId);
      if (product) {
        if (stock.quantity === 0) {
          alerts.push({
            id: 'ALERT-' + stock.id,
            productId: stock.productId,
            productName: stock.productName,
            currentStock: stock.quantity,
            minimumStock: product.minimumStock,
            severity: 'critical',
            createdAt: new Date(),
            resolved: false
          });
        } else if (stock.quantity <= product.minimumStock) {
          alerts.push({
            id: 'ALERT-' + stock.id,
            productId: stock.productId,
            productName: stock.productName,
            currentStock: stock.quantity,
            minimumStock: product.minimumStock,
            severity: 'warning',
            createdAt: new Date(),
            resolved: false
          });
        }
      }
    });

    this.alerts$.next(alerts);
  }

  getActiveAlerts(): StockAlert[] {
    return this.alerts$.value.filter(a => !a.resolved);
  }

  getStockStats() {
    const stocks = this.stocks$.value;
    return {
      totalProducts: stocks.length,
      totalQuantity: stocks.reduce((sum, s) => sum + s.quantity, 0),
      productsLowStock: stocks.filter(s => {
        const product = this.productService.getProductById(s.productId);
        return product && s.quantity <= product.minimumStock;
      }).length,
      productsOutOfStock: stocks.filter(s => s.quantity === 0).length
    };
  }

  getProductMovements(productId: string): StockMovement[] {
    return this.movements$.value.filter(m => m.productId === productId);
  }

  getProductBatches(productId: string): StockBatch[] {
    return this.batches$.value.filter(b => b.productId === productId);
  }
}