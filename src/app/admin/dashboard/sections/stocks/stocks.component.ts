import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { StockService } from '../../../../shared/services/stock.service';
import { ProductService } from '../../../../shared/services/product.service';
import { CreateAchatLotDto } from '../../../../shared/models/create-achat-lot.dto';

@Component({
  selector: 'app-admin-stocks',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './stocks.component.html',
  styleUrls: ['./stocks.component.css']
})
export class AdminStockComponent implements OnInit {

  stock: CreateAchatLotDto = {
    produitId: null as any,
    quantiteAchetee: 0,
    prixUnitaire: 0,
    fournisseur: '',
    numeroLot: ''
  };

  produits: any[] = [];
  stocks: any[] = [];

  message = '';

  constructor(
    private stockService: StockService,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.loadProduits();
    this.loadStocks();
  }

  loadProduits() {
    this.productService.getAllProducts().subscribe({
      next: res => this.produits = res
    });
  }

  loadStocks() {
    this.stockService.getAllStocks().subscribe({
      next: res => this.stocks = res
    });
  }

  onSubmit() {
    this.stockService.addAchatLot(this.stock).subscribe({
      next: () => {
        this.message = '✔ Achat créé avec succès';
        this.resetForm();
        this.loadStocks();
      },
      error: err => {
        console.error(err);
        this.message = '❌ Erreur';
      }
    });
  }

  resetForm() {
    this.stock = {
      produitId: null as any,
      quantiteAchetee: 0,
      prixUnitaire: 0,
      fournisseur: '',
      numeroLot: ''
    };
  }
}