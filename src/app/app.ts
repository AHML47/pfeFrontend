import { DOCUMENT } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Inject, OnDestroy, ViewChild } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { animate, query, style, transition, trigger } from '@angular/animations';
import { FooterComponent } from './shared/footer/footer';
import { NavbarComponent } from './shared/navbar/navbar';
import { CustomCursorComponent } from './shared/custom-cursor/custom-cursor';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, FooterComponent, CustomCursorComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
  animations: [
    trigger('routeAnimations', [
      transition('* <=> *', [
        query(':leave', [animate('320ms ease', style({ opacity: 0 }))], { optional: true }),
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(36px)' }),
          animate('550ms 80ms cubic-bezier(0.22, 1, 0.36, 1)', style({ opacity: 1, transform: 'translateY(0)' }))
        ], { optional: true })
      ])
    ])
  ]
})
export class App implements AfterViewInit, OnDestroy {
  @ViewChild('smoothContent') private smoothContent?: ElementRef<HTMLElement>;

  private frameId: number | null = null;
  private currentScroll = 0;
  private targetScroll = 0;
  private resizeObserver?: ResizeObserver; 

  constructor(
    private readonly translate: TranslateService,
    private readonly router: Router,
    @Inject(DOCUMENT) private readonly document: Document
  ) {
    this.translate.setDefaultLang('en');
    this.applyLanguage('en');
    this.applyTheme(this.getSavedTheme());

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const scrollTrigger = (window as Window & { ScrollTrigger?: { refresh: () => void } }).ScrollTrigger;
        scrollTrigger?.refresh();
      }
    });
  }

  ngAfterViewInit(): void {
    this.setupSmoothScrolling();
  }

  ngOnDestroy(): void {
    if (this.frameId !== null) {
      cancelAnimationFrame(this.frameId);
    }
    this.resizeObserver?.disconnect();
    this.document.body.style.height = '';
  }

  applyLanguage(lang: 'en' | 'fr' | 'ar'): void {
    this.translate.use(lang);

    const html = this.document.documentElement;
    if (lang === 'ar') {
      html.setAttribute('dir', 'rtl');
      html.setAttribute('lang', 'ar');
      return;
    }

    html.setAttribute('dir', 'ltr');
    html.setAttribute('lang', lang);
  }

  toggleTheme(): void {
    const html = this.document.documentElement;
    const isDark = html.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }

  isDarkMode(): boolean {
    return this.document.documentElement.classList.contains('dark');
  }

  prepareRoute(outlet: RouterOutlet) {
    if (outlet && outlet.isActivated) {
      return outlet.activatedRouteData['animation'] || outlet.activatedRoute.routeConfig?.path;
    }
    return null;
  }

  // THE FIX: Removed the extra ': void' that was crashing the compiler
  private getSavedTheme(): 'dark' | 'light' {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark' || saved === 'light') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  private applyTheme(theme: 'dark' | 'light'): void {
    const html = this.document.documentElement;
    html.classList.toggle('dark', theme === 'dark');
  }

  private setupSmoothScrolling(): void {
    const content = this.smoothContent?.nativeElement;
    if (!content) return;

    this.resizeObserver = new ResizeObserver(() => {
      this.document.body.style.height = `${content.scrollHeight}px`;
    });
    this.resizeObserver.observe(content);

    const onScroll = () => {
      this.targetScroll = window.scrollY;
    };

    const render = () => {
      this.currentScroll += (this.targetScroll - this.currentScroll) * 0.09;
      const y = Math.round(this.currentScroll * 100) / 100;
      content.style.transform = `translate3d(0, -${y}px, 0)`;
      this.frameId = requestAnimationFrame(render);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    render();
  }
}