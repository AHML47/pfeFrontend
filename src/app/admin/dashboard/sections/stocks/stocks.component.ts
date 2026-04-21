import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StockService } from '../../../../shared/services/stock.service';
import { ProductService } from '../../../../shared/services/product.service';
import { Product } from '../../../../shared/models/product.model';
import { Transaction, TypeMouvement } from '../../../../shared/models/stock.model';

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

  stats: any = {};

  showBatchModal = false;
  showHistoryModal = false;

  modalMode: 'add' | 'edit' = 'add';

  selectedHistory: Transaction[] = [];
  selectedProductName = '';

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
    this.loadStats();
  }

  // ======================
  // STATS
  // ======================
  loadStats() {
    this.stockService.getAllStocks().subscribe(stocks => {

      const totalQuantity = stocks.reduce((sum, s) => sum + (s.quantity || 0), 0);

      this.stats = {
        totalProducts: this.products.length,
        totalQuantity: totalQuantity,
        productsLowStock: this.products.filter(p =>
          (p.stockActuel || 0) < (p.minimumStock || 0)
        ).length,
        productsOutOfStock: this.products.filter(p =>
          (p.stockActuel || 0) === 0
        ).length
      };
    });
  }

  // ======================
  // LOAD DATA
  // ======================
  loadData() {

    this.stockService.getAllStocks().subscribe(data => {
      this.stocks = data;
    });

    this.productService.getAllProducts().subscribe(data => {
      this.products = data;
      this.loadStats();
    });

    this.stockService.getActiveAlerts().subscribe(data => {
      this.activeAlerts = data;
    });
  }

  // ======================
  // PRODUCT FINDER
  // ======================
  getProduct(productId: string): Product | undefined {
    return this.products.find(p => p.id === +productId);
  }

  // ======================
  // MODALS
  // ======================
  openAddModal() {
    this.modalMode = 'add';
    this.resetBatchForm();
    this.showBatchModal = true;
  }

  openEditModal(stock: any) {
    this.modalMode = 'edit';

    this.batchForm = {
      productId: stock.productId,
      quantity: stock.quantity,
      purchasePrice: 0,
      supplier: '',
      notes: ''
    };

    this.showBatchModal = true;
  }

  closeBatchModal() {
    this.showBatchModal = false;
  }

  deleteStock(id: number) {
    console.log("Delete stock:", id);
    // TODO backend delete
  }

  // ======================
  // FORM CHANGE
  // ======================
  onProductChange() {
    const product = this.products.find(p => p.id === +this.batchForm.productId);
    if (product) {
      this.batchForm.purchasePrice = (product as any).prixAchat || 0;
    }
  }

  // ======================
  // SAVE STOCK (ACHAT LOT)
  // ======================
  saveBatch() {

    const product = this.products.find(p => p.id === +this.batchForm.productId);
    if (!product) return;

    const achat = {
      produitId: this.batchForm.productId,
      quantiteAchetee: this.batchForm.quantity,
      prixAchatUnitaire: this.batchForm.purchasePrice,
      fournisseur: this.batchForm.supplier,
      numeroLot: this.batchForm.notes,
      dateAchat: new Date()
    };

    this.stockService.addAchatLot(achat).subscribe(() => {
      this.loadData();
      this.loadStats();
      this.closeBatchModal();
      this.resetBatchForm();
    });
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

  // ======================
  // HISTORY
  // ======================
  openHistoryModal(productId: string) {

    const product = this.getProduct(productId);
    this.selectedProductName = product?.nom || '';

    this.stockService.getTransactionsByProduit(productId).subscribe(data => {
      this.selectedHistory = data;
      this.showHistoryModal = true;
    });
  }

  closeHistoryModal() {
    this.showHistoryModal = false;
    this.selectedHistory = [];
  }

  getTypeMouvement(type: TypeMouvement) {
    const map: any = {
      ENTREE: '📥 Entrée',
      SORTIE: '📤 Sortie',
      AJUSTEMENT: '⚙️ Ajustement'
    };
    return map[type] || type;
  }
}