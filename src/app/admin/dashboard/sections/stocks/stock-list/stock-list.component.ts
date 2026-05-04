import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StockService } from '../../../../../shared/services/stock.service';

import {
  StockLot,
  StatutLot,
  getStatutLot,
  pourcentage
} from '../../../../../shared/models/stock.model';

@Component({
  selector: 'app-stock-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './stock-list.component.html',
  styleUrls: ['./stock-list.component.css']
})
export class StockListComponent implements OnInit {

  allLots: StockLot[]      = [];
  filteredLots: StockLot[] = [];

  searchText = '';
  statutFilter: StatutLot | '' = '';

  loading   = true;
  sortField = 'dateReception';
  sortAsc   = true;

  get totalLots(): number {
    return this.allLots.length;
  }

  get lotsVides(): number {
    return this.allLots.filter(l => l.quantiteRestante === 0).length;
  }

  get lotsFaibles(): number {
    return this.allLots.filter(l => this.statut(l) === 'faible').length;
  }

  get totalUnites(): number {
    return this.allLots.reduce((s, l) => s + l.quantiteRestante, 0);
  }

  constructor(private stockService: StockService) {}

  ngOnInit(): void {
    this.loadStockLots();
  }

  loadStockLots(): void {
    this.loading = true;

    this.stockService.getAllStockLots().subscribe({
      next: (data: StockLot[]) => {
        this.allLots = data;
        this.applyFilters();
        this.loading = false;
      },
      error: (err: any) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  applyFilters(): void {
    let result = [...this.allLots];

    if (this.searchText.trim()) {
      const q = this.searchText.toLowerCase();
      result = result.filter(l =>
        l.achatLot?.produit?.nom?.toLowerCase().includes(q) ||
        l.achatLot?.numeroLot?.toLowerCase().includes(q) ||
        l.achatLot?.fournisseur?.toLowerCase().includes(q)
      );
    }

    if (this.statutFilter) {
      result = result.filter(l => this.statut(l) === this.statutFilter);
    }

    result.sort((a, b) => {
      let va: any, vb: any;

      switch (this.sortField) {
        case 'produitNom':
          va = a.achatLot?.produit?.nom ?? '';
          vb = b.achatLot?.produit?.nom ?? '';
          break;
        case 'numeroLot':
          va = a.achatLot?.numeroLot ?? '';
          vb = b.achatLot?.numeroLot ?? '';
          break;
        case 'fournisseur':
          va = a.achatLot?.fournisseur ?? '';
          vb = b.achatLot?.fournisseur ?? '';
          break;
        case 'quantiteRestante':
          va = a.quantiteRestante;
          vb = b.quantiteRestante;
          break;
        default:
          va = a.dateReception;
          vb = b.dateReception;
      }

      const cmp = va < vb ? -1 : va > vb ? 1 : 0;
      return this.sortAsc ? cmp : -cmp;
    });

    this.filteredLots = result;
  }

  setSort(field: string): void {
    this.sortField = this.sortField === field
      ? (this.sortAsc = !this.sortAsc, field)
      : (this.sortAsc = true, field);

    this.applyFilters();
  }

  resetFilters(): void {
    this.searchText = '';
    this.statutFilter = '';
    this.applyFilters();
  }

  statut(lot: StockLot): StatutLot {
    return getStatutLot(lot);
  }

  pct(lot: StockLot): number {
    return pourcentage(lot);
  }
}