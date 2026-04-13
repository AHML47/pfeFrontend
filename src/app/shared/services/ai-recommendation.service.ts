import { Injectable, Inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { AIRecommendation, AIRecommendationHistory } from '../models/ai-recommendation.model';
import { ProductService } from './product.service';
import { StockService } from './stock.service';

@Injectable({
  providedIn: 'root'
})
export class AIRecommendationService {
  private recommendations$ = new BehaviorSubject<AIRecommendation[]>([]);
  private history$ = new BehaviorSubject<AIRecommendationHistory[]>([]);
  private isBrowser: boolean;

  public recommendations = this.recommendations$.asObservable();
  public history = this.history$.asObservable();

  constructor(
    private productService: ProductService,
    private stockService: StockService,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.initializeRecommendations();
  }

  private initializeRecommendations() {
    if (!this.isBrowser) return;

    const saved = localStorage.getItem('ai_recommendations');
    if (saved) {
      this.recommendations$.next(JSON.parse(saved));
    } else {
      this.generateInitialRecommendations();
    }

    const savedHistory = localStorage.getItem('ai_recommendation_history');
    if (savedHistory) {
      this.history$.next(JSON.parse(savedHistory));
    }
  }

  private generateInitialRecommendations() {
    const recs: AIRecommendation[] = [];

    const alerts = this.stockService.getActiveAlerts();
    alerts.forEach(alert => {
      if (alert.severity === 'critical') {
        recs.push({
          id: 'REC-' + Date.now() + '-' + Math.random().toString(36).substring(7),
          type: 'reorder',
          productId: alert.productId,
          productName: alert.productName,
          title: '⚠️ Stock critique',
          description: `Le produit ${alert.productName} est en rupture de stock. Vous devez le réapprovisionner immédiatement.`,
          actionRequired: true,
          suggestedAction: `Ajouter au minimum 50 unités de ${alert.productName}`,
          confidence: 95,
          createdAt: new Date(),
          actionTaken: false
        });
      } else if (alert.severity === 'warning') {
        recs.push({
          id: 'REC-' + Date.now() + '-' + Math.random().toString(36).substring(7),
          type: 'reorder',
          productId: alert.productId,
          productName: alert.productName,
          title: '⚠️ Stock faible',
          description: `Le stock de ${alert.productName} approche du minimum. Un réapprovisionnement est recommandé.`,
          actionRequired: false,
          suggestedAction: `Considérer l'ajout de 30-50 unités de ${alert.productName}`,
          confidence: 85,
          createdAt: new Date(),
          actionTaken: false
        });
      }
    });

    const products = this.productService.getAllProducts();
    if (products.length > 0) {
      recs.push({
        id: 'REC-TRENDING-001',
        type: 'trending',
        productId: products[0].id,
        productName: products[0].name,
        title: '📈 Produit tendance',
        description: `${products[0].name} a eu une forte augmentation de ventes cette semaine.`,
        actionRequired: false,
        suggestedAction: 'Augmenter la visibilité marketing de ce produit',
        confidence: 80,
        createdAt: new Date(),
        actionTaken: false
      });
    }

    this.saveRecommendations(recs);
  }

  private saveRecommendations(recs: AIRecommendation[]) {
    if (this.isBrowser) {
      localStorage.setItem('ai_recommendations', JSON.stringify(recs));
    }
    this.recommendations$.next(recs);
  }

  private saveHistory(history: AIRecommendationHistory[]) {
    if (this.isBrowser) {
      localStorage.setItem('ai_recommendation_history', JSON.stringify(history));
    }
    this.history$.next(history);
  }

  getAllRecommendations(): AIRecommendation[] {
    return this.recommendations$.value;
  }

  getActiveRecommendations(): AIRecommendation[] {
    return this.recommendations$.value.filter(r => !r.actionTaken);
  }

  getUrgentRecommendations(): AIRecommendation[] {
    return this.getActiveRecommendations().filter(r => r.actionRequired);
  }

  markAsActioned(recId: string, actionDetails: string = ''): AIRecommendation | undefined {
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

  dismissRecommendation(recId: string): void {
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

  private removeRecommendation(recId: string): void {
    const recs = this.recommendations$.value.filter(r => r.id !== recId);
    this.saveRecommendations(recs);
  }

  private addToHistory(histEntry: Omit<AIRecommendationHistory, 'id'>): void {
    const history = this.history$.value;
    history.push({
      id: 'HIST-' + Date.now(),
      ...histEntry
    });
    this.saveHistory(history);
  }

  generateNewRecommendations(): void {
    this.generateInitialRecommendations();
  }

  getRecommendationById(id: string): AIRecommendation | undefined {
    return this.recommendations$.value.find(r => r.id === id);
  }

  getRecommendationsByType(type: string): AIRecommendation[] {
    return this.recommendations$.value.filter(r => r.type === type);
  }

  getHistory(filter?: 'accepted' | 'rejected' | 'dismissed'): AIRecommendationHistory[] {
    let history = this.history$.value;
    if (filter) {
      history = history.filter(h => h.action === filter);
    }
    return history;
  }
}