import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { tap, catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { 
  Stock, 
  StockLot,      // ✅ était StockBatch
  StockAlert, 
  Transaction,   // ✅ était StockMovement
  AchatLot,
  TypeMouvement
} from '../models/stock.model';

@Injectable({
  providedIn: 'root'
})
export class StockService {
  addStockBatch(arg0: { productId: string; quantity: number; unitCost: number; totalCost: number; supplierId: string; batchDate: Date; }) {
    throw new Error('Method not implemented.');
  }
  getProductMovements(productId: string) {
    throw new Error('Method not implemented.');
  }

  private readonly API_URL = `${environment.apiEndpoint}/stocks`;

  // ✅ BehaviorSubjects avec les bons types
  private stocks$     = new BehaviorSubject<Stock[]>([]);
  private lots$       = new BehaviorSubject<StockLot[]>([]);        // ✅ était batches$
  private transactions$ = new BehaviorSubject<Transaction[]>([]);   // ✅ était movements$
  private alerts$     = new BehaviorSubject<StockAlert[]>([]);

  public stocks       = this.stocks$.asObservable();
  public lots         = this.lots$.asObservable();                  // ✅
  public transactions = this.transactions$.asObservable();          // ✅
  public alerts       = this.alerts$.asObservable();

  constructor(private http: HttpClient) {
    this.loadStocks().subscribe();
  }

  // ==============================
  // 🔹 INIT
  // ==============================

  private loadStocks(): Observable<Stock[]> {
    return this.http.get<Stock[]>(this.API_URL).pipe(
      tap(stocks => this.stocks$.next(stocks)),
      catchError(() => {
        console.error('API stock indisponible');
        this.stocks$.next([]);
        return of([]);
      })
    );
  }

  loadLots(): Observable<StockLot[]> {                              // ✅ était loadBatches
    return this.http.get<StockLot[]>(`${this.API_URL}/lots`).pipe(  // ✅ /lots (pas /batches)
      tap(lots => this.lots$.next(lots)),
      catchError(() => of([]))
    );
  }

  loadTransactions(): Observable<Transaction[]> {                   // ✅ était loadMovements
    return this.http.get<Transaction[]>(`${this.API_URL}/transactions`).pipe(
      tap(t => this.transactions$.next(t)),
      catchError(() => of([]))
    );
  }

  loadAlerts(): Observable<StockAlert[]> {
    return this.http.get<StockAlert[]>(`${this.API_URL}/alerts`).pipe(
      tap(a => this.alerts$.next(a)),
      catchError(() => of([]))
    );
  }

  // ==============================
  // 🔹 STOCK
  // ==============================

  getAllStocks(): Observable<Stock[]> {
    return this.http.get<Stock[]>(this.API_URL).pipe(
      tap(stocks => this.stocks$.next(stocks)),
      catchError(() => of([]))
    );
  }

  // ✅ Retourne le stock agrégé d'un produit (stockDisponible = Σ quantiteRestante)
  getStockByProduit(produitId: string): Observable<Stock | null> {
    return this.http.get<Stock>(`${this.API_URL}/produit/${produitId}`).pipe(
      catchError(() => of(null))
    );
  }

  // ==============================
  // 🔹 STOCK LOTS (Achat fournisseur)
  // ==============================

  // ✅ était addStockBatch — crée un AchatLot + StockLot côté backend
  addAchatLot(achat: Omit<AchatLot, 'id'>): Observable<AchatLot | null> {
    return this.http.post<AchatLot>(`${this.API_URL}/achats`, achat).pipe(
      tap(() => this.loadStocks().subscribe()), // ✅ recalcule le stock après achat
      catchError(() => of(null))
    );
  }

  // ✅ Retourne les lots d'un produit (pour afficher le détail du stock)
  getLotsByProduit(produitId: string): Observable<StockLot[]> {
    return this.http.get<StockLot[]>(`${this.API_URL}/lots/produit/${produitId}`).pipe(
      catchError(() => of([]))
    );
  }

  // ==============================
  // 🔹 TRANSACTIONS (Mouvements)
  // ==============================

  // ✅ était addStockMovement
  addTransaction(transaction: Omit<Transaction, 'id'>): Observable<Transaction | null> {
    return this.http.post<Transaction>(`${this.API_URL}/transactions`, transaction).pipe(
      tap(newT => {
        const current = this.transactions$.value;
        this.transactions$.next([...current, newT]);
      }),
      catchError(() => of(null))
    );
  }

  getTransactionsByProduit(produitId: string): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.API_URL}/transactions/produit/${produitId}`).pipe(
      catchError(() => of([]))
    );
  }

  // ==============================
  // 🔹 DECREMENT (VENTE / SORTIE)
  // ==============================

  // ✅ Crée une Transaction de type SORTIE + déduit de StockLot.quantiteRestante
  decrementStock(produitId: string, quantite: number): Observable<boolean> {
    return this.http.post<void>(`${this.API_URL}/sortie`, {
      produitId,
      quantite,
      type: TypeMouvement.SORTIE
    }).pipe(
      tap(() => this.loadStocks().subscribe()),
      map(() => true),
      catchError(() => of(false))
    );
  }

  // ==============================
  // 🔹 ALERTS
  // ==============================

  getActiveAlerts(): Observable<StockAlert[]> {
    return this.http.get<StockAlert[]>(`${this.API_URL}/alerts/active`).pipe(
      tap(alerts => this.alerts$.next(alerts)),
      catchError(() => of([]))
    );
  }

  // ==============================
  // 🔹 STATISTIQUES
  // ==============================

  getStockStats(): Observable<any> {
    return this.http.get(`${this.API_URL}/stats`).pipe(
      catchError(() => of({
        totalProduits: 0,
        totalQuantite: 0,
        produitsStockBas: 0,
        produitsRupture: 0
      }))
    );
  }

  // ==============================
  // 🔹 CACHE LOCAL
  // ==============================

  getStocks(): Stock[] {
    return this.stocks$.value;
  }

  getLots(): StockLot[] {
    return this.lots$.value;
  }
}