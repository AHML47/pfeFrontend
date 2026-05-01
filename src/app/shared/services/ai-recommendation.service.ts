import { Injectable, Inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { AIRecommendation, AIRecommendationHistory } from '../models/ai-recommendation.model';
import { ProductService } from './product.service';
import { StockService } from './stock.service';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AIRecommendationService {
  private readonly API_URL = environment.apiEndpoint;

  private apiUrl =this.API_URL + '/recommendations';

  private recommendations$ = new BehaviorSubject<AIRecommendation[]>([]);
  private history$ = new BehaviorSubject<AIRecommendationHistory[]>([]);

  public recommendations = this.recommendations$.asObservable();
  public history = this.history$.asObservable();

  constructor(
    private http: HttpClient,
    private productService: ProductService,
    private stockService: StockService,
  ) {
    this.initializeRecommendations();
  }

  // ================= INIT =================

  private initializeRecommendations() {
    // this.http.get<AIRecommendation[]>(this.apiUrl).subscribe({
    //   next: (data) => this.recommendations$.next(data),
    //   error: () => {
    //     console.log('API indisponible → fallback local');
    //     this.loadFromLocal();
    //   }
    // });

    // this.loadHistoryFromLocal();
  }

  private loadFromLocal() {
    const saved = localStorage.getItem('ai_recommendations');
    if (saved) {
      this.recommendations$.next(JSON.parse(saved));
    } else {
      this.generateInitialRecommendations();
    }
  }

  private loadHistoryFromLocal() {
    const savedHistory = localStorage.getItem('ai_recommendation_history');
    if (savedHistory) {
      this.history$.next(JSON.parse(savedHistory));
    }
  }

  // ================= FIX IMPORTANT =================
  private generateInitialRecommendations() {

    // 🔥 FIX 1 : convertir Observable → array via subscription
    // this.stockService.getActiveAlerts().subscribe(alerts => {

    //   this.productService.getAllProducts().subscribe(products => {

    //     const recs: AIRecommendation[] = [];

    //     // ✅ FIX StockAlert correct
    //     alerts.forEach(alert => {
    //       if (alert.severity === 'critical') {
    //         recs.push({
    //           id: 'REC-' + Date.now(),
    //           type: 'reorder',
    //           productId: alert.productId.toString(),
    //           productName: alert.productName ?? 'Produit inconnu',
    //           title: '⚠️ Stock critique',
    //           description: `Le produit ${alert.productName ?? 'inconnu'} est en rupture de stock.`,
    //           actionRequired: true,
    //           suggestedAction: `Ajouter 50 unités`,
    //           confidence: 95,
    //           createdAt: new Date(),
    //           actionTaken: false
    //         });
    //       }
    //     });

    //     // ✅ FIX products[0]
    //     if (products && products.length > 0) {
    //       recs.push({
    //         id: 'REC-TREND',
    //         type: 'trending',
    //         productId: products[0].id.toString(),
    //         productName: products[0].nom,
    //         title: '📈 Produit tendance',
    //         description: `${products[0].nom} en hausse de ventes`,
    //         actionRequired: false,
    //         suggestedAction: 'Boost marketing',
    //         confidence: 80,
    //         createdAt: new Date(),
    //         actionTaken: false
    //       });
    //     }

    //     this.saveRecommendations(recs);
    //   });
    // });
  }

  // ================= SAVE =================

  private saveRecommendations(recs: AIRecommendation[]) {

    this.http.post(this.apiUrl, recs).subscribe({
      next: () => console.log('Sauvegardé API'),
      error: () => {
          localStorage.setItem('ai_recommendations', JSON.stringify(recs));
      }
    });

    localStorage.setItem('ai_recommendations', JSON.stringify(recs));

    this.recommendations$.next(recs);
  }

  private saveHistory(history: AIRecommendationHistory[]) {
    localStorage.setItem('ai_recommendation_history', JSON.stringify(history));
    this.history$.next(history);
  }

  // ================= GET =================

  getAllRecommendations(): AIRecommendation[] {
    return this.recommendations$.value;
  }

  getActiveRecommendations(): AIRecommendation[] {
    return this.recommendations$.value.filter(r => !r.actionTaken);
  }

  getUrgentRecommendations(): AIRecommendation[] {
    return this.getActiveRecommendations().filter(r => r.actionRequired);
  }

  // ================= ACTIONS =================

  markAsActioned(recId: string, actionDetails: string = '') {
    const recs = this.recommendations$.value;
    const rec = recs.find(r => r.id === recId);

    if (rec) {
      rec.actionTaken = true;
      rec.actionTakenAt = new Date();
      rec.actionDetails = actionDetails;

      this.saveRecommendations(recs);

      this.addToHistory({
        recommendation: rec,
        action: 'accepted',
        date: new Date(),
        result: actionDetails
      });

      return rec;
    }

    return undefined;
  }

  dismissRecommendation(recId: string) {
    const history = this.history$.value;
    const rec = this.recommendations$.value.find(r => r.id === recId);

    if (rec) {
      history.push({
        id: 'HIST-' + Date.now(),
        recommendation: rec,
        action: 'dismissed',
        date: new Date()
      });

      this.saveHistory(history);
      this.removeRecommendation(recId);
    }
  }

  private removeRecommendation(recId: string) {
    const recs = this.recommendations$.value.filter(r => r.id !== recId);
    this.saveRecommendations(recs);
  }

  private addToHistory(histEntry: Omit<AIRecommendationHistory, 'id'>) {
    const history = this.history$.value;

    history.push({
      id: 'HIST-' + Date.now(),
      ...histEntry
    });

    this.saveHistory(history);
  }

  generateNewRecommendations() {
    this.generateInitialRecommendations();
  }

  getHistory(): AIRecommendationHistory[] {
    return this.history$.value;
  }
}