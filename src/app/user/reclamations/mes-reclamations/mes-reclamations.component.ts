import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReclamationService } from '../../../shared/services/reclamation.service';
import { Reclamation, ReclamationStatus } from '../../../shared/models/reclamation.model';

@Component({
  selector: 'app-mes-reclamations',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mes-reclamations.component.html',
  styleUrls: ['./mes-reclamations.component.css'],
})
export class MesReclamationsComponent implements OnInit {
  reclamations: Reclamation[] = [];
  loading = true;
  error = '';
  selectedReclamation: Reclamation | null = null;

  readonly statusColors: Record<ReclamationStatus, string> = {
    'En attente': 'status-pending',
    'En cours':   'status-progress',
    'Résolue':    'status-resolved',
    'Rejetée':    'status-rejected',
  };

  readonly statusIcons: Record<ReclamationStatus, string> = {
    'En attente': '⏳',
    'En cours':   '🔄',
    'Résolue':    '✅',
    'Rejetée':    '❌',
  };

  constructor(private reclamationService: ReclamationService) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.reclamationService.getMesReclamations().subscribe({
      next: (data) => { this.reclamations = data; this.loading = false; },
      error: () => { this.error = 'Impossible de charger vos réclamations.'; this.loading = false; },
    });
  }

  openDetail(r: Reclamation): void  { this.selectedReclamation = r; }
  closeDetail(): void               { this.selectedReclamation = null; }

  delete(id: number): void {
    if (!confirm('Supprimer cette réclamation ?')) return;
    this.reclamationService.delete(id).subscribe({
      next: () => {
        this.reclamations = this.reclamations.filter(r => r.id !== id);
        if (this.selectedReclamation?.id === id) this.closeDetail();
      },
      error: () => alert('Erreur lors de la suppression.'),
    });
  }
}