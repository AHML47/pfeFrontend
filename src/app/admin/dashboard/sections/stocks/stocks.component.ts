import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StockService } from '../../../../shared/services/stock.service';
import { ProductService } from '../../../../shared/services/product.service';
import { StockBatch } from '../../../../shared/models/stock.model';
import { Product } from '../../../../shared/models/product.model';

@Component({
  selector: 'app-admin-stocks',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './stocks.component.html',
  styleUrls: ['./stocks.component.css']
})
export class AdminStocksComponent implements OnInit {
  stocks: any[] = [];
  products: Product[] = [];
  activeAlerts: any[] = [];
  showBatchModal: boolean = false;

  batchForm = {
    productId: '',
    quantity: 0,
    purchasePrice: 0,
    supplier: '',
    notes: ''
  };

  constructor(
    private stockService: StockService,
    private productService: ProductService
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.stocks = this.stockService.getAllStocks();
    this.products = this.productService.getAllProducts();
    this.activeAlerts = this.stockService.getActiveAlerts();
  }

  getStats() {
    return this.stockService.getStockStats();
  }

  getProduct(productId: string): Product | undefined {
    return this.products.find(p => p.id === productId);
  }

  openBatchModal() {
    this.resetBatchForm();
    this.showBatchModal = true;
  }

  closeBatchModal() {
    this.showBatchModal = false;
    this.resetBatchForm();
  }

  resetBatchForm() {
    this.batchForm = {
      productId: '',
      quantity: 0,
      purchasePrice: 0,
      supplier: '',
      notes: ''
    };
  }

  saveBatch() {
    if (!this.batchForm.productId || this.batchForm.quantity <= 0 || this.batchForm.purchasePrice <= 0) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    const product = this.products.find(p => p.id === this.batchForm.productId);
    if (!product) return;

    this.stockService.addStockBatch({
      productId: this.batchForm.productId,
      productName: product.name,
      quantity: this.batchForm.quantity,
      purchasePrice: this.batchForm.purchasePrice,
      supplier: this.batchForm.supplier,
      notes: this.batchForm.notes,
      batchDate: new Date()
    });

    alert('Lot d\'achat ajouté avec succès!');
    this.closeBatchModal();
    this.loadData();
  }

  getProductName(productId: string): string {
    return this.products.find(p => p.id === productId)?.name || 'Inconnu';
  }

  getSeverity(severity: string): string {
    return severity === 'critical' ? '🔴 CRITIQUE' : '🟡 ALERTE';
  }
}