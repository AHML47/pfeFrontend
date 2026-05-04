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

  stock: CreateAchatLotDto = this.emptyForm();

  produits: any[] = [];
  loading = false;
  message = '';
  messageType: 'success' | 'error' | '' = '';

  get totalAchat(): number {
    return +(this.stock.quantiteAchetee * this.stock.prixUnitaire).toFixed(2);
  }

  constructor(
    private stockService: StockService,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.loadProduits();
  }

  loadProduits(): void {
    this.productService.getAllProducts().subscribe({
      next: (data) => (this.produits = data),
      error: (err) => console.error('Erreur chargement produits', err)
    });
  }

  onSubmit(): void {
    if (!this.stock.produitId) {
      this.setMessage('Veuillez sélectionner un produit.', 'error');
      return;
    }
    if (this.stock.quantiteAchetee < 1) {
      this.setMessage('Le nombre de packs doit être au moins 1.', 'error');
      return;
    }
    if (this.stock.prixUnitaire <= 0) {
      this.setMessage('Le prix unitaire doit être supérieur à 0.', 'error');
      return;
    }

    this.loading = true;
    this.message = '';

    this.stockService.addAchatLot(this.stock).subscribe({
      next: () => {
        this.setMessage(
          `${this.stock.quantiteAchetee} pack(s) créés avec succès.`,
          'success'
        );
        this.stock = this.emptyForm();
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        const detail = err?.error?.message || 'Erreur lors de la création.';
        this.setMessage(detail, 'error');
        this.loading = false;
      }
    });
  }

  resetForm(): void {
    this.stock = this.emptyForm();
    this.message = '';
    this.messageType = '';
  }

  private emptyForm(): CreateAchatLotDto {
    return {
      produitId: null as any,
      quantiteAchetee: 1,
      prixUnitaire: 0,
      fournisseur: '',
      numeroLot: ''
    };
  }

  private setMessage(msg: string, type: 'success' | 'error'): void {
    this.message = msg;
    this.messageType = type;
  }
}