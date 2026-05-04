import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../shared/services/cart.service';
import { OrderService } from '../../shared/services/order.service';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class CartComponent implements OnInit {
  cartItems: any[] = [];
  totalPrice: number = 0;
  savedTotal: number = 0;
  loading: boolean = false;
  showModal: boolean = false;
  orderCreated: any = null;

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef // 👈 ajouter
  ) {}

  ngOnInit() {
    this.loadCart();
  }

  loadCart() {
    this.cartItems = this.cartService.getCart();
    this.calculateTotal();
  }

  calculateTotal() {
    this.totalPrice = this.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  removeItem(id: number) {
    this.cartService.removeFromCart(id);
    this.loadCart();
  }

  updateQuantity(id: number, quantity: number) {
    const item = this.cartItems.find(i => i.id === id);
    if (item && quantity > 0) {
      item.quantity = quantity;
      this.calculateTotal();
    }
  }

  clearCart() {
    if (confirm('Êtes-vous sûr de vouloir vider le panier?')) {
      this.cartService.clearCart();
      this.loadCart();
    }
  }

  checkout() {
    if (this.cartItems.length === 0) {
      alert('Votre panier est vide');
      return;
    }

    this.loading = true;
    this.savedTotal = this.totalPrice;

    const orderDto = {
      items: this.cartItems.map(item => ({
        produitId: item.id,
        quantite: item.quantity
      }))
    };

    this.orderService.createOrder(orderDto).subscribe({
      next: (order) => {
        this.orderCreated = order;
        this.totalPrice = this.savedTotal;
        this.cartService.clearCart();
        this.loadCart();
        this.showModal = true;
        this.cdr.detectChanges(); // 👈 forcer la mise à jour
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur commande:', err);
        this.loading = false;
        alert('Erreur lors de la création de la commande');
      }
    });
  }

  closeModal() {
    this.showModal = false;
  }

  followOrder() {
    this.showModal = false;
    this.router.navigate(['/user/orders']);
  }

  continueShopping() {
    this.router.navigate(['/user/products']);
  }
}