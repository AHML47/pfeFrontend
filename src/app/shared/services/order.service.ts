import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export interface Order {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  deliveryAddress: string;
  items: OrderItem[];
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'preparation' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  id: number;
  name: string;
  productName: string;
  price: number;
  quantity: number;
  image: string;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private orders: Order[] = [];
  private isBrowser: boolean;
  private orderCounter: number = 0;

  constructor(private authService: AuthService, @Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);

    if (this.isBrowser) {
      const storedOrders = localStorage.getItem('orders');
      if (storedOrders) {
        const parsedOrders = JSON.parse(storedOrders);
        this.orders = parsedOrders.filter((order: any) => order.id.startsWith('CMD-'));
      }

      const savedCounter = localStorage.getItem('orderCounter');
      this.orderCounter = savedCounter ? parseInt(savedCounter) : this.orders.length;

      this.saveOrders();
    }
  }

  createOrder(items: any[]): Order | null {
    const user = this.authService.getCurrentUser();
    if (!user || items.length === 0) {
      return null;
    }

    const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    this.orderCounter++;
    const year = new Date().getFullYear();
    const orderNumber = String(this.orderCounter).padStart(4, '0');
    const orderId = `CMD-${year}-${orderNumber}`;

    const order: Order = {
      id: orderId,
      userId: user.id,
      userName: user.name,
      userEmail: user.email ?? '',
      deliveryAddress: user.address ?? '',
      items: items,
      totalPrice: totalPrice,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.orders.push(order);
    this.saveOrders();
    this.saveOrderCounter();

    return order;
  }

  getUserOrders(): Order[] {
    const user = this.authService.getCurrentUser();
    if (!user) return [];

    return this.orders.filter(order => order.userId === user.id);
  }

  getAllOrders(): Order[] {
    return this.orders;
  }

  getOrder(id: string): Order | undefined {
    return this.orders.find(order => order.id === id);
  }

  updateOrderStatus(id: string, status: Order['status']): void {
    const order = this.orders.find(order => order.id === id);
    if (order) {
      order.status = status;
      order.updatedAt = new Date();
      this.saveOrders();
    }
  }

  clearAllOrders(): void {
    this.orders = [];
    this.orderCounter = 0;
    if (this.isBrowser) {
      localStorage.removeItem('orders');
      localStorage.removeItem('orderCounter');
    }
  }

  private saveOrderCounter(): void {
    if (this.isBrowser) {
      localStorage.setItem('orderCounter', this.orderCounter.toString());
    }
  }

  private saveOrders(): void {
    if (this.isBrowser) {
      localStorage.setItem('orders', JSON.stringify(this.orders));
    }
  }
}