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

  // ================= REFRESH =================
  private refresh$ = new BehaviorSubject<number>(0);

  // ================= DATA =================
  groupedStocks$!: Observable<StockGrouped[]>;
  produits: any[] = [];

  // ================= STATS =================
  totalLots = 0;
  totalStock = 0;
  totalProducts = 0;

  // ================= PANELS CONTROL =================
  activePanel: 'stock' | 'products' | 'lots' = 'stock';

  showProductsPanel = false; // (gardé compat si utilisé ailleurs)

  // ================= UI STATES =================
  showForm = false;
  editingId: number | null = null;
  expandedId: number | null = null;

  selectedLot: AchatLotResponse | null = null;
  loadingDetail = false;

  productsStock: any[] = [];
  transactionsMap: { [key: number]: any[] } = {};

  // ================= FORM =================
  stock: CreateAchatLotDto = {
    produitId: 0,
    quantiteAchetee: 0,
    prixUnitaire: 0,
    fournisseur: '',
    numeroLot: ''
  };

  constructor(private stockService: StockService) {}

  // ================= INIT =================
  ngOnInit(): void {
    this.activePanel = 'stock';
    this.loadProduits();

    this.groupedStocks$ = this.refresh$.pipe(
      switchMap(() => this.stockService.getStock()),
      tap((data: AchatLotResponse[]) => {

        this.totalLots = data.length;

        this.totalStock = data.reduce(
          (sum, a) =>
            sum + a.stockLots.reduce(
              (s, lot) => s + (lot.quantiteRestante ?? 0),
              0
            ),
          0
        );
      }),
      map((data: AchatLotResponse[]) =>
        data.map(a => ({
          achatLotId: a.id,
          numeroLot: a.numeroLot || '—',
          nomProduit: a.produit?.nom ?? '—',
          fournisseur: a.fournisseur || '—',
          dateAchat: a.dateAchat,
          totalQuantity: a.stockLots.reduce(
            (s, lot) => s + (lot.quantiteRestante ?? 0),
            0
          ),
          transactions: (a as any).transactions ?? []
        }))
      )
    );
  }

  // ================= LOAD PRODUITS =================
  loadProduits() {
    this.stockService.getProduits().subscribe(data => {
      this.produits = data;
    });
  }

  // ================= PRODUCTS PANEL =================
  toggleProductsPanel() {
  this.activePanel = 'products';

  this.stockService.getStock().subscribe((data: AchatLotResponse[]) => {

    const map = new Map<string, any>();

    data.forEach(a => {

      const productName = a.produit?.nom ?? '—';

      if (!map.has(productName)) {
        map.set(productName, {
          nomProduit: productName,
          lots: 0,
          quantite: 0
        });
      }

      const entry = map.get(productName);

      a.stockLots.forEach(lot => {
        entry.lots += 1;
        entry.quantite += lot.quantiteRestante ?? 0;
      });
    });

    this.productsStock = Array.from(map.values());
    this.totalProducts = this.productsStock.length;
  });
}
  // ================= LOT DETAIL =================
 selectLot(id: number) {
  if (this.selectedLot?.id === id) {
    this.selectedLot = null;
    this.activePanel = 'stock';
    return;
  }

  this.loadingDetail = true;

  this.stockService.getAchatById(id).subscribe({
    next: (data: AchatLotResponse) => {
      this.selectedLot = data;
      this.loadingDetail = false;
      this.activePanel = 'lots'; // ← déplace ici, après réception
      
      // charge transactions en même temps
      const transactions: any[] = [];
      data.stockLots?.forEach((lot: any) => {
        if (lot.transactions) {
          transactions.push(...lot.transactions);
        }
      });
      this.transactionsMap[id] = transactions;
    },
    error: (err) => {
      console.error('ERREUR:', err);
      this.loadingDetail = false;
    }
  });
}

 // ================= TOGGLE TRANSACTIONS =================
toggleTransactions(id: number) {
  // ferme si déjà ouvert
  if (this.expandedId === id) {
    this.expandedId = null;
    return;
  }

  // si déjà chargé (même vide) → ouvre directement
  if (id in this.transactionsMap) {
    this.expandedId = id;
    return;
  }

  // sinon charge d'abord, puis ouvre
  this.stockService.getAchatById(id).subscribe(res => {
    const transactions: any[] = [];
    res.stockLots?.forEach((lot: any) => {
      if (lot.transactions) {
        transactions.push(...lot.transactions);
      }
    });
    this.transactionsMap[id] = transactions;
    this.expandedId = id;
  });
}
  // ================= FORM OPEN =================
  openAchatForm() {
    this.activePanel = 'stock';
    this.editingId = null;

    const count = this.totalLots + 1;
    const numero = count.toString().padStart(3, '0');

    this.stock = {
      produitId: 0,
      quantiteAchetee: 0,
      prixUnitaire: 0,
      fournisseur: '',
      numeroLot: `LOT-${numero}`
    };

    this.showForm = true;
  }

  // ================= EDIT =================
  openEditForm(s: StockGrouped) {
    this.activePanel = 'stock';
    this.editingId = s.achatLotId;

    this.stock = {
      produitId: 0,
      quantiteAchetee: s.totalQuantity,
      prixUnitaire: 0,
      fournisseur: s.fournisseur,
      numeroLot: s.numeroLot
    };

    this.showForm = true;
  }

  // ================= SUBMIT =================
  onSubmit() {
    if (!this.editingId && this.stock.produitId === 0) {
      alert('Veuillez choisir un produit.');
      return;
    }

    if (this.stock.quantiteAchetee <= 0) {
      alert('Quantité invalide.');
      return;
    }

    const request$ = this.editingId
      ? this.stockService.updateAchat(this.editingId, this.stock)
      : this.stockService.createAchat(this.stock);

    request$.subscribe({
      next: () => {
        this.showForm = false;
        this.editingId = null;

        this.stock = {
          produitId: 0,
          quantiteAchetee: 0,
          prixUnitaire: 0,
          fournisseur: '',
          numeroLot: ''
        };

        this.refresh$.next(this.refresh$.value + 1);
      },
      error: (err) =>
        alert('Erreur : ' + (err.error?.message ?? err.status))
    });
  }

  // ================= DELETE =================
  deleteLot(id: number) {
    if (!confirm('Supprimer ce lot ?')) return;

    this.stockService.deleteAchat(id).subscribe({
      next: () => this.refresh$.next(this.refresh$.value + 1),
      error: (err) => alert('Erreur suppression : ' + err.status)
    });
  }

  // ================= STATUS =================
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