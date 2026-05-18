import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';
import { OrderService } from '../../../core/services/order.service';
import { PanierService } from '../../../core/services/panier.service';
import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../user.products';

@Component({
  selector: 'app-product-details',
  imports: [CommonModule, FormsModule],
  templateUrl: './product-details.html',
  styleUrl: './product-details.css'
})
export class ProductDetailsComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly productService = inject(ProductService);
  private readonly orderService = inject(OrderService);
  private readonly panierService = inject(PanierService);

  product?: Product;
  loading = true;
  quantity = 1;
  deliveryAddress = '';
  shippingFee = 0;
  isSubmitting = false;
  isAddingToCart = false;
  errorMessage = '';
  successMessage = '';

  ngOnInit(): void {
    const productId = Number(this.route.snapshot.paramMap.get('id'));

    if (Number.isNaN(productId)) {
      this.loading = false;
      this.errorMessage = 'The requested product could not be found.';
      return;
    }

    this.productService.getProductById(productId).subscribe((product) => {
      this.product = product;
      this.loading = false;

      if (!product) {
        this.errorMessage = 'The requested product could not be found.';
      }
    });
  }

  orderNow(): void {
    if (!this.product || this.quantity < 1 || this.isSubmitting) {
      return;
    }

    const availableQuantity = this.product.nbUnite ?? this.quantity;
    const requestedQuantity = Math.min(Math.floor(this.quantity), availableQuantity || this.quantity);

    if (requestedQuantity < 1) {
      this.errorMessage = 'Please select a valid quantity.';
      return;
    }

    if (!this.deliveryAddress.trim()) {
      this.errorMessage = 'Please enter a delivery address.';
      return;
    }

    this.quantity = requestedQuantity;
    this.errorMessage = '';
    this.successMessage = '';
    this.isSubmitting = true;

    this.orderService
      .createOrder({
        articles: [
          {
            produitId: this.product.id,
            quantite: this.quantity,
            prixUnitaire: this.product.price
          }
        ],
        adresseLivraison: this.deliveryAddress.trim(),
        fraisLivraison: this.shippingFee
      })
      .pipe(finalize(() => (this.isSubmitting = false)))
      .subscribe({
        next: ({ orderId }) => {
          this.successMessage = `Order #${orderId} has been created successfully.`;
        },
        error: () => {
          this.errorMessage = 'Unable to create your order right now. Please try again.';
        }
      });
  }

  addToCart(): void {
    if (!this.product || this.isAddingToCart) return;
    this.isAddingToCart = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.panierService.addItem({ produitId: this.product.id, quantite: this.quantity }).subscribe({
      next: () => {
        this.successMessage = `${this.product!.name} ajouté au panier.`;
        this.isAddingToCart = false;
      },
      error: () => {
        this.errorMessage = 'Impossible d\'ajouter au panier. Veuillez réessayer.';
        this.isAddingToCart = false;
      }
    });
  }

  goBack(): void {
    void this.router.navigate(['/products']);
  }

}
