import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AIRecommendationService } from '../../../../shared/services/ai-recommendation.service';
import { AIRecommendation } from '../../../../shared/models/ai-recommendation.model';

@Component({
  selector: 'app-admin-ai',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ai.component.html',
  styleUrl: './ai.component.css'
})
export class AdminAIComponent implements OnInit {
  activeRecommendations: AIRecommendation[] = [];
  urgentRecommendations: AIRecommendation[] = [];
  history: any[] = [];
  showHistory: boolean = false;

  constructor(private aiService: AIRecommendationService) {}

  ngOnInit() {
    this.loadRecommendations();
  }

  loadRecommendations() {
    this.activeRecommendations = this.aiService.getActiveRecommendations();
    this.urgentRecommendations = this.aiService.getUrgentRecommendations();
    this.history = this.aiService.getHistory();
  }

  acceptRecommendation(rec: AIRecommendation) {
    const actionDetails = prompt('Détails de l\'action prise:');
    if (actionDetails) {
      this.aiService.markAsActioned(rec.id, actionDetails);
      alert('Recommandation acceptée et enregistrée!');
      this.loadRecommendations();
    }
  }

  dismissRecommendation(rec: AIRecommendation) {
    if (confirm('Supprimer cette recommandation?')) {
      this.aiService.dismissRecommendation(rec.id);
      alert('Recommandation ignorée!');
      this.loadRecommendations();
    }
  }

  generateNewRecommendations() {
    if (confirm('Regénérer les recommandations? Cela remplacera les recommandations actuelles.')) {
      this.aiService.generateNewRecommendations();
      alert('Nouvelles recommandations générées!');
      this.loadRecommendations();
    }
  }

  toggleHistory() {
    this.showHistory = !this.showHistory;
  }

  getTypeIcon(type: string): string {
    const icons: { [key: string]: string } = {
      'reorder': '📦',
      'discount': '💰',
      'trending': '📈',
      'low-stock': '⚠️'
    };
    return icons[type] || '🤖';
  }

  getTypeLabel(type: string): string {
    const labels: { [key: string]: string } = {
      'reorder': 'Réapprovisionnement',
      'discount': 'Promotion',
      'trending': 'Tendance',
      'low-stock': 'Stock faible'
    };
    return labels[type] || type;
  }

  getConfidenceColor(confidence: number): string {
    if (confidence >= 90) return 'high';
    if (confidence >= 75) return 'medium';
    return 'low';
  }
}
