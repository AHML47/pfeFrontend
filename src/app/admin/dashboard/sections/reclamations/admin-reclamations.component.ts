import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule, FormBuilder, FormGroup, Validators,
} from '@angular/forms';
import { ReclamationService } from '../../../../shared/services/reclamation.service';
import {
  Reclamation, ReclamationStatus, TraiterReclamationDto,
} from '../../../../shared/models/reclamation.model';

@Component({
  selector: 'app-admin-reclamations',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-reclamations.component.html',
  styleUrls: ['./admin-reclamations.component.css'],
})
export class AdminReclamationsComponent implements OnInit {
  reclamations: Reclamation[] = [];
  filtered: Reclamation[] = [];
  loading = true;
  error = '';

  selectedReclamation: Reclamation | null = null;
  traiterForm!: FormGroup;
  savingTraiter = false;
  traiterSuccess = false;

  filterStatus: ReclamationStatus | 'Toutes' = 'Toutes';

  readonly statuses: (ReclamationStatus | 'Toutes')[] = [
    'Toutes', 'En attente', 'En cours', 'Résolue', 'Rejetée',
  ];

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

  constructor(
    private reclamationService: ReclamationService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.traiterForm = this.fb.group({
      status:       ['', Validators.required],
      reponseAdmin: ['', [Validators.required, Validators.minLength(10)]],
    });
    this.load();
  }

  load(): void {
    this.loading = true;
    this.reclamationService.getAll().subscribe({
      next: (data) => { this.reclamations = data; this.applyFilter(); this.loading = false; },
      error: () => { this.error = 'Impossible de charger les réclamations.'; this.loading = false; },
    });
  }

  applyFilter(): void {
    this.filtered = this.filterStatus === 'Toutes'
      ? this.reclamations
      : this.reclamations.filter(r => r.status === this.filterStatus);
  }

  setFilter(s: ReclamationStatus | 'Toutes'): void {
    this.filterStatus = s;
    this.applyFilter();
  }

  openTraiter(r: Reclamation): void {
    this.selectedReclamation = r;
    this.traiterSuccess = false;
    this.traiterForm.reset({ status: r.status, reponseAdmin: r.reponseAdmin ?? '' });
  }

  closeTraiter(): void { this.selectedReclamation = null; }

  submitTraiter(): void {
    if (this.traiterForm.invalid) { this.traiterForm.markAllAsTouched(); return; }
    if (!this.selectedReclamation) return;
    this.savingTraiter = true;
    const dto: TraiterReclamationDto = this.traiterForm.value;
    this.reclamationService.traiter(this.selectedReclamation.id, dto).subscribe({
      next: (updated) => {
        const idx = this.reclamations.findIndex(r => r.id === updated.id);
        if (idx > -1) this.reclamations[idx] = updated;
        this.applyFilter();
        this.traiterSuccess = true;
        this.savingTraiter = false;
        setTimeout(() => this.closeTraiter(), 1500);
      },
      error: () => { this.savingTraiter = false; alert('Erreur lors du traitement.'); },
    });
  }

  get f() { return this.traiterForm.controls; }

  get counts(): Record<string, number> {
    const c: Record<string, number> = { Toutes: this.reclamations.length };
    for (const r of this.reclamations) c[r.status] = (c[r.status] ?? 0) + 1;
    return c;
  }
}