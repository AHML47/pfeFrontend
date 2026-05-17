import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnInit, QueryList, ViewChildren, inject } from '@angular/core';
import gsap from '../../../shared/gsap-lite';
import { CategoryService } from '../../../core/services/category.service';
import { ProductService } from '../../../core/services/product.service';
import { Category, Product } from '../../../user.products';
import { ProductCardComponent } from '../product-card/product-card';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-product-list',
  imports: [CommonModule, ProductCardComponent, TranslateModule],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css'
})
export class ProductListComponent implements OnInit, AfterViewInit {
  @ViewChildren('gridItem') gridItems!: QueryList<ElementRef<HTMLElement>>;

  private readonly productService = inject(ProductService);
  private readonly categoryService = inject(CategoryService);

  products: Product[] = [];
  filteredProducts: Product[] = [];
  categories: Category[] = [];
  selectedCategoryId: number | 'all' = 'all';

  ngOnInit(): void {
    this.productService.getProducts().subscribe((products) => {
      this.products = products;
      this.filteredProducts = products;
      queueMicrotask(() => this.animateIn());
    });

    this.categoryService.getCategories().subscribe((categories) => {
      this.categories = categories;
    });
  }

  ngAfterViewInit(): void {
    this.animateIn();
  }

  filterByCategory(categoryId: number | 'all'): void {
    this.selectedCategoryId = categoryId;

    const nodes = this.gridItems.map((item) => item.nativeElement);
    gsap.to(nodes, {
      scale: 0.96,
      opacity: 0,
      duration: 0.2,
      stagger: 0.03,
      onComplete: () => {
        this.filteredProducts =
          categoryId === 'all' ? this.products : this.products.filter((p) => p.categoryId === categoryId);
        queueMicrotask(() => this.animateIn());
      }
    });
  }

  private animateIn(): void {
    const nodes = this.gridItems?.map((item) => item.nativeElement) ?? [];
    if (!nodes.length) return;

    gsap.fromTo(
      nodes,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.08, duration: 0.45, ease: 'power2.out' }
    );
  }
}
