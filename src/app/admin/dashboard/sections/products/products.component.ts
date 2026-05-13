import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';

import { ProductService } from '../../../../shared/services/product.service';
import { CategoryService } from '../../../../shared/services/category.service';
import { Product, ProductFormData } from '../../../../shared/models/product.model';
import { Category } from '../../../../shared/models/category.model';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class AdminProductsComponent implements OnInit {

  private refresh$ = new BehaviorSubject<void>(undefined);

  private search$ = new BehaviorSubject<string>('');

  products$!: Observable<Product[]>;
  categories$!: Observable<Category[]>;
  filteredProducts$!: Observable<Product[]>;

  error: string | null = null;

  showForm = false;
  editMode = false;
  selectedId: number | null = null;

  form: ProductFormData = {
    nom: '',
    description: '',
    prix: 0,
    nbUnite: 0,
    categorieId: 0
  };

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.initStreams();
  }

  initStreams(): void {

    this.products$ = this.refresh$.pipe(
      switchMap(() =>
        this.productService.getAllProducts().pipe(
          catchError(() => {
            this.error = 'Erreur chargement produits';
            return of([]);
          })
        )
      )
    );

    this.categories$ = this.categoryService.getAll().pipe(
      catchError(() => of([]))
    );

    this.filteredProducts$ = combineLatest([
      this.products$,
      this.search$.pipe(startWith(''))
    ]).pipe(
      map(([products, search]) => {
        const q = search.toLowerCase();

        return products.filter(p =>
          p.nom.toLowerCase().includes(q)
        );
      })
    );
  }

  onSearch(value: string): void {
    this.search$.next(value);
  }

  private reload(): void {
    this.refresh$.next();
  }

  openAddForm(): void {
    this.showForm = true;
    this.editMode = false;
    this.selectedId = null;

    this.form = {
      nom: '',
      description: '',
      prix: 0,
      nbUnite:0,
      categorieId: 0

    };
  }

  openEditForm(p: Product): void {
    this.showForm = true;
    this.editMode = true;
    this.selectedId = p.id;

    this.form = {
      nom: p.nom,
      description: p.description,
      prix: p.prixAchat,
      nbUnite: p.nbUnite,
      categorieId: p.categorieId
    };
  }

  closeForm(): void {
    this.showForm = false;
    this.error = null;
  }

  // ================= SAVE =================
 save(): void {
  this.form.categorieId = Number(this.form.categorieId); // 🔒 force number

  if (!this.form.nom.trim()) {
    this.error = 'Nom obligatoire';
    return;
  }

  if (!this.form.categorieId || this.form.categorieId === 0) {
    this.error = 'Choisir une catégorie';
    return;
  }

    this.error = null;

    const request$ = this.editMode && this.selectedId
      ? this.productService.updateProduct(this.selectedId, this.form)
      : this.productService.addProduct(this.form);

    request$.subscribe({
      next: () => {
        this.closeForm();
        this.reload();
      }
    });
  }

  // ================= DELETE =================
  delete(id: number): void {
    if (!confirm('Supprimer ce produit ?')) return;

    this.productService.deleteProduct(id).subscribe({
      next: () => this.reload()
    });
  }

  getCategoryName(categories: Category[] | null, id: number): string {
  return categories?.find(c => c.id === id)?.nom || 'N/A';
}
}