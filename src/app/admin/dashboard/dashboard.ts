import { CommonModule, CurrencyPipe, DecimalPipe } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
  inject
} from '@angular/core';
import gsap from '../../shared/gsap-lite';
import { DashboardService } from '../../core/services/dashboard.service';
import { OrderService } from '../../core/services/order.service';
import { StockService } from '../../core/services/stock.service';
import { ReclamationService } from '../../core/services/reclamation.service';
import { TranslateModule } from '@ngx-translate/core';
import { DashboardStats, Order, Reclamation, StockItem } from '../../user.products';

type TabKey = 'overview' | 'orders' | 'products' | 'reclamations';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, DecimalPipe, TranslateModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class AdminDashboardComponent implements OnInit, AfterViewInit {
  private readonly dashboardService = inject(DashboardService);
  private readonly orderService = inject(OrderService);
  private readonly stockService = inject(StockService);
  private readonly reclamationService = inject(ReclamationService);

  @ViewChild('activeIndicator') activeIndicator?: ElementRef<HTMLElement>;
  @ViewChildren('tabItem') tabItems?: QueryList<ElementRef<HTMLElement>>;
  @ViewChildren('statCard') statCards?: QueryList<ElementRef<HTMLElement>>;

  isSidebarOpen = false;
  activeTab: TabKey = 'overview';

  readonly tabs: { key: TabKey; label: string; icon: string }[] = [
    { key: 'overview', label: 'ADMIN.OVERVIEW', icon: '◈' },
    { key: 'orders', label: 'ADMIN.ORDERS', icon: '⎘' },
    { key: 'products', label: 'ADMIN.INVENTORY', icon: '◫' },
    { key: 'reclamations', label: 'ADMIN.RECLAMATIONS', icon: '⚑' }
  ];

  stats: DashboardStats = { revenue: 0, totalOrders: 0, activeUsers: 0 };
  orders: Order[] = [];
  inventory: StockItem[] = [];
  reclamations: Reclamation[] = [];

  animatedRevenue = 0;
  animatedOrders = 0;
  animatedUsers = 0;

  ngOnInit(): void {
    this.dashboardService.getStats().subscribe({
      next: (s) => {
        this.stats = s;
        setTimeout(() => this.countUp(), 300);
      }
    });

    this.orderService.getOrders().subscribe({ next: (o) => (this.orders = o) });
    this.stockService.getStock().subscribe({ next: (s) => (this.inventory = s) });
    this.reclamationService.getAllReclamations().subscribe({ next: (r) => (this.reclamations = r) });
  }

  ngAfterViewInit(): void {
    this.animateCards();
    this.moveIndicator();
  }

  selectTab(tab: TabKey): void {
    this.activeTab = tab;
    this.isSidebarOpen = false;
    setTimeout(() => this.moveIndicator(), 0);
  }

  private moveIndicator(): void {
    const indicator = this.activeIndicator?.nativeElement;
    const tabs = this.tabItems?.toArray() ?? [];
    const target = tabs.find(
      (tabRef) => tabRef.nativeElement.dataset['tab'] === this.activeTab
    )?.nativeElement;
    if (!indicator || !target) return;
    gsap.to(indicator, { y: target.offsetTop, duration: 0.35 });
  }

  private animateCards(): void {
    const cards = this.statCards?.map((card) => card.nativeElement) ?? [];
    gsap.fromTo(cards, { y: 24, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.1, duration: 0.5 });
  }

  private countUp(): void {
    const duration = 900;
    const startedAt = performance.now();
    const endRevenue = this.stats.revenue;
    const endOrders = this.stats.totalOrders;
    const endUsers = this.stats.activeUsers;

    const tick = (now: number): void => {
      const linear = Math.min(1, (now - startedAt) / duration);
      const progress = 1 - Math.pow(1 - linear, 3);
      this.animatedRevenue = Math.floor(endRevenue * progress);
      this.animatedOrders = Math.floor(endOrders * progress);
      this.animatedUsers = Math.floor(endUsers * progress);
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }
}
