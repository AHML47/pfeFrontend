import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { switchMap, map, tap } from 'rxjs/operators';

import { StockService } from '../../../../shared/services/stock.service';
import { CreateAchatLotDto } from '../../../../shared/models/create-achat-lot.dto';
import { AchatLotResponse } from '../../../../shared/models/stock-lot.model';
import { StockGrouped } from '../../../../shared/models/stock-grouped.model';

@Component({
  selector: 'app-admin-stocks',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './stocks.component.html',
  styleUrls: ['./stocks.component.css']
})
export class AdminStockComponent implements OnInit {

  private refresh$ = new BehaviorSubject<void>(undefined);

  groupedStocks$!: Observable<StockGrouped[]>;
  produits: any[] = [];
  totalLots = 0;
  totalStock = 0;
  showForm = false;

  stock: CreateAchatLotDto = {
    produitId: 0,
    quantiteAchetee: 0,
    prixUnitaire: 0,
    fournisseur: '',
    numeroLot: ''
  };

  constructor(private stockService: StockService) {}

  ngOnInit(): void {
    this.loadProduits();

    this.groupedStocks$ = this.refresh$.pipe(
      switchMap(() => this.stockService.getStock()),
      tap((data: AchatLotResponse[]) => {
        this.totalLots = data.length;
        this.totalStock = data.reduce(
          (sum, a) => sum + a.stockLots.reduce(
            (s, lot) => s + (lot.quantiteRestante ?? 0), 0
          ), 0
        );
      }),
      map((data: AchatLotResponse[]) =>
        data.map(a => ({
          achatLotId: a.id,
          numeroLot: a.numeroLot || '—',
          nomProduit: a.produit?.nom ?? '—',
          fournisseur: a.fournisseur || '—',
          dateAchat: a.dateAchat,
          // ← qté achetée en unités = stockLots restante initiale
          // on affiche le total restant uniquement, plus cohérent
          totalQuantity: a.stockLots.reduce(
            (s, lot) => s + (lot.quantiteRestante ?? 0), 0
          )
        }))
      )
    );
  }

  loadProduits() {
    this.stockService.getProduits().subscribe(data => {
      this.produits = data;
    });
  }

  reload() { this.refresh$.next(); }

  openAchatForm() {
    const count = this.totalLots + 1;
    const numero = count.toString().padStart(3, '0');
    this.stock.numeroLot = `LOT-${numero}`;
    this.showForm = true;
  }

  onSubmit() {
    if (this.stock.produitId === 0) {
      alert('Veuillez choisir un produit.');
      return;
    }
    if (this.stock.quantiteAchetee <= 0) {
      alert('La quantité doit être supérieure à 0.');
      return;
    }
    if (!this.stock.numeroLot) {
      const count = this.totalLots + 1;
      this.stock.numeroLot = `LOT-${count.toString().padStart(3, '0')}`;
    }

    this.stockService.createAchat(this.stock).subscribe({
      next: () => {
        this.showForm = false;
        this.stock = {
          produitId: 0,
          quantiteAchetee: 0,
          prixUnitaire: 0,
          fournisseur: '',
          numeroLot: ''
        };
        this.reload();
      },
      error: (err) => {
        alert('Erreur : ' + (err.error?.message ?? err.status));
      }
    });
  }

  // Statut basé sur quantité absolue
  getStockStatus(qty: number): string {
    if (qty === 0) return 'RUPTURE';
    if (qty <= 20) return 'FAIBLE';
    return 'OK';
  }

  getStatusClass(qty: number): string {
    if (qty === 0) return 'rupture';
    if (qty <= 20) return 'faible';
    return 'ok';
  }
}