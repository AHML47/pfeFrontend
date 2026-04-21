import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Delivery {
  id: number;
  adresseLivraison: string;
  dateLivraisonPrevue: Date;
  dateLivraisonReel?: Date;
  statut: 'en attente' | 'en cours' | 'livré' | 'annulé';
}

@Component({
  selector: 'app-admin-deliveries',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './deliveries.component.html',
  styleUrls: ['./deliveries.component.css']
})
export class AdminDeliveriesComponent implements OnInit {

  deliveries: Delivery[] = [];
  showModal = false;
  modalMode: 'add' | 'edit' = 'add';

  form: Delivery = this.resetForm();

  ngOnInit() {
    this.loadDeliveries();
  }

  loadDeliveries() {
    // Simule une récupération depuis une API
    this.deliveries = [
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

  openAddModal() {
    this.modalMode = 'add';
    this.form = this.resetForm();
    this.showModal = true;
  }

  openEditModal(delivery: Delivery) {
    this.modalMode = 'edit';
    this.form = { ...delivery };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  resetForm(): Delivery {
    return {
      id: 0,
      adresseLivraison: '',
      dateLivraisonPrevue: new Date(),
      statut: 'en attente'
    };
  }

  saveDelivery() {
    if (!this.form.adresseLivraison || !this.form.dateLivraisonPrevue) {
      alert('Veuillez remplir tous les champs');
      return;
    }

    if (this.modalMode === 'add') {
      this.form.id = Math.max(...this.deliveries.map(d => d.id), 0) + 1;
      this.deliveries.push(this.form);
    } else {
      const index = this.deliveries.findIndex(d => d.id === this.form.id);
      if (index > -1) {
        this.deliveries[index] = this.form;
      }
    }

    this.closeModal();
    alert('Livraison sauvegardée !');
  }

  deleteDelivery(id: number) {
    if (confirm('Supprimer cette livraison ?')) {
      this.deliveries = this.deliveries.filter(d => d.id !== id);
      alert('Livraison supprimée !');
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