import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Delivery {
  id: number;
  adresseLivraison: string;
  dateLivraisonPrevue: Date;
  dateLivraisonReel?: Date;
  statut: 'en attente' | 'en cours' | 'livré' | 'annulé';
}

@Component({
  selector: 'app-user-deliveries',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './deliveries.component.html',
  styleUrls: ['./deliveries.component.css']
})
export class UserDeliveriesComponent implements OnInit {

  myDeliveries: Delivery[] = [];

  ngOnInit() {
    this.loadMyDeliveries();
  }

  loadMyDeliveries() {
    // Simule une récupération depuis une API
    this.myDeliveries = [
      {
        id: 1,
        adresseLivraison: '123 Rue de Paris, Tunis',
        dateLivraisonPrevue: new Date('2026-04-25'),
        dateLivraisonReel: new Date('2026-04-24'),
        statut: 'livré'
      },
      {
        id: 2,
        adresseLivraison: '456 Avenue Mohamed Ali, Sfax',
        dateLivraisonPrevue: new Date('2026-04-26'),
        statut: 'en cours'
      }
    ];
  }

  getStatusBadge(statut: string): string {
    switch (statut) {
      case 'livré': return '✓ Livré';
      case 'en cours': return '🚚 En cours';
      case 'en attente': return '⏳ En attente';
      case 'annulé': return '❌ Annulé';
      default: return statut;
    }
  }

  getStatusColor(statut: string): string {
    switch (statut) {
      case 'livré': return 'green';
      case 'en cours': return 'orange';
      case 'en attente': return 'blue';
      case 'annulé': return 'red';
      default: return 'gray';
    }
  }
}