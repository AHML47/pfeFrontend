import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ReclamationService } from '../../../shared/services/reclamation.service';
import { ReclamationType } from '../../../shared/models/reclamation.model';

@Component({
  selector: 'app-create-reclamation',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-reclamation.component.html',
  styleUrls: ['./create-reclamation.component.css'],
})
export class CreateReclamationComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  success = false;
  error = '';

  readonly types: ReclamationType[] = [
    'Produit manquant',
    'Mauvais produit reçu',
    'Quantité incorrecte',
    'Produit endommagé',
    'Retard de livraison',
    'Autre problème',
  ];

  readonly typeIcons: Record<ReclamationType, string> = {
    'Produit manquant': '📦',
    'Mauvais produit reçu': '🔄',
    'Quantité incorrecte': '⚖️',
    'Produit endommagé': '💔',
    'Retard de livraison': '⏰',
    'Autre problème': '❓',
  };

  constructor(
    private fb: FormBuilder,
    private reclamationService: ReclamationService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      orderId: [null, [Validators.required, Validators.min(1)]],
      sujet: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(20)]],
    });
  }

  selectType(type: ReclamationType): void {
    this.form.patchValue({ sujet: type });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading = true;
    this.error = '';
    this.reclamationService.create(this.form.value).subscribe({
      next: () => {
        this.success = true;
        this.form.reset();
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.message || 'Une erreur est survenue.';
        this.loading = false;
      },
    });
  }

  get f() { return this.form.controls; }
}