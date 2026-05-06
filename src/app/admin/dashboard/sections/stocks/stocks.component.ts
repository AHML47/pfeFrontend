import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';

import { StockService } from '../../../../shared/services/stock.service';
import { ProductService } from '../../../../shared/services/product.service';
import { CreateAchatLotDto } from '../../../../shared/models/create-achat-lot.dto';

interface GroupedStock {
  productId: number;
  productName: string;
  totalQuantity: number;
}

@Component({
  selector: 'app-admin-stocks',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './stocks.component.html',
  styleUrls: ['./stocks.component.css']
})
export class AdminStockComponent implements OnInit {

  private refresh$ = new BehaviorSubject<void>(undefined);

  stocks$!: Observable<any[]>;
  groupedStocks$!: Observable<GroupedStock[]>;
  produits$!: Observable<any[]>;

  message = '';
  error: string | null = null;

  showForm = false;

  // ✅ VIEW MODE (dashboard navigation)
  viewMode: 'products' | 'lots' | 'stock' | null = null;

  currentPage = 1;
  pageSize = 10;
  totalPages = 1;

  selectedProductId: number | null = null;

  stock: CreateAchatLotDto = this.emptyStock();

  totalLots = 0;
  totalStock = 0;

  constructor(
    private stockService: StockService,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.initStreams();
  }

  // ================= VIEW =================
  setView(mode: 'products' | 'lots' | 'stock') {
    this.viewMode = mode;
  }

  // ================= STREAMS =================
  initStreams(): void {

    this.produits$ = this.productService.getAllProducts().pipe(
      catchError(() => of([]))
    );

    this.stocks$ = this.refresh$.pipe(
      switchMap(() =>
        this.stockService.getAllStockLots().pipe(
          tap(data => {
            this.totalLots = data.length;

            this.totalStock = data.reduce(
              (sum: number, s: any) => sum + (s.quantiteRestante || 0),
              0
            );
          }),
          catchError(() => {
            this.error = 'Erreur chargement stocks';
            return of([]);
          })
        )
      )
    );

    this.groupedStocks$ = this.stocks$.pipe(
      map(stocks => {

        const mapGroup = new Map<number, GroupedStock>();

        for (const s of stocks) {

          if (this.selectedProductId && s.produitId !== this.selectedProductId) {
            continue;
          }

          const productId = s.produitId;
          const productName = s.produitNom || 'Produit';

          if (!mapGroup.has(productId)) {
            mapGroup.set(productId, {
              productId,
              productName,
              totalQuantity: 0
            });
          }

          mapGroup.get(productId)!.totalQuantity += (s.quantiteRestante || 0);
        }

        const list = Array.from(mapGroup.values());

        this.totalPages = Math.max(1, Math.ceil(list.length / this.pageSize));

        const start = (this.currentPage - 1) * this.pageSize;
        const end = start + this.pageSize;

        return list.slice(start, end);
      })
    );
  }

  // ================= FILTER =================
  onProductChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;

    this.selectedProductId = value ? Number(value) : null;
    this.currentPage = 1;
    this.reload();
  }

  // ================= RELOAD =================
  private reload(): void {
    this.refresh$.next();
  }

  // ================= STOCK STATUS =================
  getStockClass(qty: number): string {
    if (qty <= 10) return 'stock-low';
    if (qty <= 30) return 'stock-medium';
    return 'stock-high';
  }

  getStockLabel(qty: number): string {
    if (qty <= 10) return 'Faible';
    if (qty <= 30) return 'Moyen';
    return 'Bon';
  }

  // ================= SUBMIT =================
  onSubmit(): void {

    this.stock.numeroLot = this.generateLotNumber();

    this.stockService.addAchatLot(this.stock).pipe(
      tap(() => {
        this.message = '✔ Achat créé avec succès';
        this.stock = this.emptyStock();
        this.showForm = false;
        setTimeout(() => this.reload(), 300);
      }),
      catchError(() => {
        this.message = '❌ Erreur lors de l’ajout';
        return of(null);
      })
    ).subscribe();
  }

  generateLotNumber(): string {
    return 'LOT-' +
      Date.now().toString(36).toUpperCase() +
      '-' +
      Math.random().toString(36).substring(2, 8).toUpperCase();
  }

  private emptyStock(): CreateAchatLotDto {
    return {
      produitId: null as any,
      quantiteAchetee: 0,
      prixUnitaire: 0,
      fournisseur: '',
      numeroLot: ''
    };
  }
}