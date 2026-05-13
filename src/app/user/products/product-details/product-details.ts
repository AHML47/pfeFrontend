import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { CartService } from '../../../shared/services/cart.service';
import { AuthService } from '../../../shared/services/auth.service';
import { ProductService } from '../../../shared/services/product.service';
import { CategoryService } from '../../../shared/services/category.service';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-details.html',
  styleUrl: './product-details.css',
})
export class ProductDetails implements OnInit {

  product: any = null;
  quantity: number = 1;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cartService: CartService,
    private authService: AuthService,
    private productService: ProductService,
    private categoryService: CategoryService,
    private cdr: ChangeDetectorRef // 👈 ajouter
  ) {}

  ngOnInit() {
    const id = +this.route.snapshot.params['id'];

    forkJoin({
      categories: this.categoryService.getAll(),
      products: this.productService.getAllProducts()
    }).subscribe({
      next: ({ categories, products }) => {
        const categorieMap: { [id: number]: string } = {};
        categories.forEach(c => categorieMap[c.id] = c.nom);

        const found = (products as any[]).find(p => p.id === id);

        if (found) {
          this.product = {
            id: found.id,
            name: found.nom,
  price: found.prixAchat ?? found.prixVente ?? 0,             description: found.description,
            stock: found.stockDisponible ?? 0,
            category: categorieMap[found.categorieId] ?? 'Sans catégorie',
    image: found.imageUrl ?? found.image ?? '/assets/default.png'  // ← fix image
          };
          this.cdr.detectChanges(); // 👈 forcer la mise à jour
        }
      },
      error: (err) => console.log(err)
    });
  }

  addToCart() {
    if (!this.authService.isLoggedIn()) {
      alert('Login requis');
      this.router.navigate(['/user/login']);
      return;
    }

    for (let i = 0; i < this.quantity; i++) {
      this.cartService.addToCart(this.product);
    }

    alert('Produit ajouté');
  }

  increaseQuantity() {
    if (this.product && this.quantity < this.product.stock) {
      this.quantity++;
    }
  }

  decreaseQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  goBack() {
    this.router.navigate(['/user/products']);
  }
}