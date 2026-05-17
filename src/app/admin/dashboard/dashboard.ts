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
import { FormsModule } from '@angular/forms';
import gsap from '../../shared/gsap-lite';
import { DashboardService } from '../../core/services/dashboard.service';
import { OrderService } from '../../core/services/order.service';
import { StockService } from '../../core/services/stock.service';
import { ReclamationService } from '../../core/services/reclamation.service';
import { CategoryService } from '../../core/services/category.service';
import { ProductService } from '../../core/services/product.service';
import { AchatLotService, CreateAchatLotDto } from '../../core/services/achat-lot.service';
import { TranslateModule } from '@ngx-translate/core';
import { AchatLot, Category, DashboardStats, Order, Product, Reclamation, StockItem } from '../../user.products';

type TabKey = 'overview' | 'orders' | 'products' | 'reclamations' | 'categories' | 'achats';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, DecimalPipe, TranslateModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class AdminDashboardComponent implements OnInit, AfterViewInit {
  private readonly dashboardService = inject(DashboardService);
  private readonly orderService = inject(OrderService);
  private readonly stockService = inject(StockService);
  private readonly reclamationService = inject(ReclamationService);
  private readonly categoryService = inject(CategoryService);
  private readonly productService = inject(ProductService);
  private readonly achatLotService = inject(AchatLotService);

  @ViewChild('activeIndicator') activeIndicator?: ElementRef<HTMLElement>;
  @ViewChildren('tabItem') tabItems?: QueryList<ElementRef<HTMLElement>>;
  @ViewChildren('statCard') statCards?: QueryList<ElementRef<HTMLElement>>;

  isSidebarOpen = false;
  activeTab: TabKey = 'overview';

  readonly tabs: { key: TabKey; label: string; icon: string }[] = [
    { key: 'overview', label: 'ADMIN.OVERVIEW', icon: '◈' },
    { key: 'orders', label: 'ADMIN.ORDERS', icon: '⎘' },
    { key: 'products', label: 'ADMIN.INVENTORY', icon: '◫' },
    { key: 'reclamations', label: 'ADMIN.RECLAMATIONS', icon: '⚑' },
    { key: 'categories', label: 'ADMIN.CATEGORIES', icon: '⊞' },
    { key: 'achats', label: 'ADMIN.ACHAT_LOTS', icon: '⊕' }
  ];

  stats: DashboardStats = { revenue: 0, totalOrders: 0, activeUsers: 0 };
  orders: Order[] = [];
  inventory: StockItem[] = [];
  reclamations: Reclamation[] = [];
  categories: Category[] = [];
  products: Product[] = [];
  achatLots: AchatLot[] = [];

  showAchatForm = false;
  achatDraft: CreateAchatLotDto = { produitId: 0, quantiteAchetee: 0, prixUnitaire: 0, fournisseur: '', supplierId: undefined };

  showCategoryForm = false;
  editingCategoryId: number | null = null;
  categoryDraft = { nom: '', description: '' };

  showProductForm = false;
  editingProductId: number | null = null;
  productDraft: {
    libelle: string;
    prixVente: number | null;
    idCategorie: number | null;
    description: string;
    nbUnite: number | null;
    seuil: number | null;
    prixModifiable: boolean;
  } = { libelle: '', prixVente: null, idCategorie: null, description: '', nbUnite: null, seuil: null, prixModifiable: false };
  productImageFile: File | null = null;

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
    this.loadCategories();
    this.loadProducts();
    this.loadAchatLots();
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

  loadProducts(): void {
    this.productService.getProducts().subscribe({ next: (p) => (this.products = p) });
  }

  getCategoryName(id: number): string {
    return this.categories.find((c) => c.id === id)?.name ?? '—';
  }

  openNewProductForm(): void {
    this.editingProductId = null;
    this.productDraft = { libelle: '', prixVente: null, idCategorie: null, description: '', nbUnite: null, seuil: null, prixModifiable: false };
    this.productImageFile = null;
    this.showProductForm = true;
  }

  editProduct(prod: Product): void {
    this.editingProductId = prod.id;
    this.productDraft = {
      libelle: prod.name,
      prixVente: prod.price,
      idCategorie: prod.categoryId || null,
      description: prod.description ?? '',
      nbUnite: prod.nbUnite ?? null,
      seuil: prod.seuil ?? null,
      prixModifiable: prod.prixModifiable ?? false
    };
    this.productImageFile = null;
    this.showProductForm = true;
  }

  onProductImageChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.productImageFile = input.files?.[0] ?? null;
  }

  saveProduct(): void {
    if (!this.productDraft.libelle.trim()) return;
    const fd = new FormData();
    fd.append('Libelle', this.productDraft.libelle);
    if (this.productDraft.prixVente !== null) fd.append('PrixVente', String(this.productDraft.prixVente));
    if (this.productDraft.idCategorie !== null) fd.append('IdCategorie', String(this.productDraft.idCategorie));
    if (this.productDraft.description) fd.append('Description', this.productDraft.description);
    if (this.productDraft.nbUnite !== null) fd.append('NbUnite', String(this.productDraft.nbUnite));
    if (this.productDraft.seuil !== null) fd.append('Seuil', String(this.productDraft.seuil));
    fd.append('PrixModifiable', String(this.productDraft.prixModifiable));
    if (this.productImageFile) fd.append('Image', this.productImageFile);
    if (this.editingProductId !== null) {
      this.productService.updateProduct(this.editingProductId, fd).subscribe({
        next: () => { this.showProductForm = false; this.loadProducts(); }
      });
    } else {
      this.productService.createProduct(fd).subscribe({
        next: () => { this.showProductForm = false; this.loadProducts(); }
      });
    }
  }

  cancelProductForm(): void {
    this.showProductForm = false;
  }

  deleteProduct(id: number): void {
    this.productService.deleteProduct(id).subscribe({ next: () => this.loadProducts() });
  }

  getProductName(id: number): string {
    return this.products.find((p) => p.id === id)?.name ?? `#${id}`;
  }

  loadAchatLots(): void {
    this.achatLotService.getAchatLots().subscribe({ next: (lots) => (this.achatLots = lots) });
  }

  openNewAchatForm(): void {
    this.achatDraft = { produitId: 0, quantiteAchetee: 0, prixUnitaire: 0, fournisseur: '', supplierId: undefined };
    this.showAchatForm = true;
  }

  saveAchat(): void {
    if (!this.achatDraft.produitId || !this.achatDraft.quantiteAchetee || !this.achatDraft.prixUnitaire || !this.achatDraft.fournisseur.trim()) return;
    const dto: CreateAchatLotDto = {
      produitId: this.achatDraft.produitId,
      quantiteAchetee: this.achatDraft.quantiteAchetee,
      prixUnitaire: this.achatDraft.prixUnitaire,
      fournisseur: this.achatDraft.fournisseur,
      ...(this.achatDraft.supplierId ? { supplierId: this.achatDraft.supplierId } : {})
    };
    this.achatLotService.createAchatLot(dto).subscribe({
      next: () => { this.showAchatForm = false; this.loadAchatLots(); }
    });
  }

  cancelAchatForm(): void {
    this.showAchatForm = false;
  }

  deleteAchatLot(id: number): void {
    this.achatLotService.deleteAchatLot(id).subscribe({ next: () => this.loadAchatLots() });
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe({ next: (cats) => (this.categories = cats) });
  }

  openNewCategoryForm(): void {
    this.editingCategoryId = null;
    this.categoryDraft = { nom: '', description: '' };
    this.showCategoryForm = true;
  }

  editCategory(cat: Category): void {
    this.editingCategoryId = cat.id;
    this.categoryDraft = { nom: cat.name, description: '' };
    this.showCategoryForm = true;
  }

  saveCategory(): void {
    if (!this.categoryDraft.nom.trim()) return;
    if (this.editingCategoryId !== null) {
      this.categoryService
        .updateCategory(this.editingCategoryId, { nom: this.categoryDraft.nom, description: this.categoryDraft.description })
        .subscribe({ next: () => { this.showCategoryForm = false; this.loadCategories(); } });
    } else {
      this.categoryService
        .createCategory({ nom: this.categoryDraft.nom, description: this.categoryDraft.description })
        .subscribe({ next: () => { this.showCategoryForm = false; this.loadCategories(); } });
    }
  }

  cancelCategoryForm(): void {
    this.showCategoryForm = false;
  }

  deleteCategory(id: number): void {
    this.categoryService.deleteCategory(id).subscribe({ next: () => this.loadCategories() });
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
