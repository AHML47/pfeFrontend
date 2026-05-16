import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

type GsapLike = {
  timeline: (config?: Record<string, unknown>) => {
    fromTo: (...args: unknown[]) => unknown;
  };
};

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.css'
})
export class HeroComponent implements AfterViewInit, OnDestroy {
  @ViewChild('heroRoot', { static: true }) heroRoot!: ElementRef<HTMLElement>;

  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private mouseHandler?: (event: MouseEvent) => void;

  ngAfterViewInit(): void {
    this.bootHeroTimeline();
    this.bindParallax();
  }

  ngOnDestroy(): void {
    if (this.mouseHandler) window.removeEventListener('mousemove', this.mouseHandler);
  }

  private bootHeroTimeline(): void {
    const gsap = (window as Window & { gsap?: GsapLike }).gsap;
    if (!gsap) return;

    const root = this.elementRef.nativeElement;
    const titleWords = root.querySelectorAll('.hero-word');

    const timeline = gsap.timeline({ defaults: { ease: 'power4.out' } as never });
    timeline.fromTo(titleWords, { yPercent: 130, opacity: 0 }, { yPercent: 0, opacity: 1, stagger: 0.08, duration: 1.1 });
    timeline.fromTo('.hero-subtitle', { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, '-=0.65' as never);
    timeline.fromTo('.hero-cta', { y: 20, opacity: 0, scale: 0.96 }, { y: 0, opacity: 1, scale: 1, duration: 0.7 }, '-=0.45' as never);
  }

  private bindParallax(): void {
    this.mouseHandler = (event: MouseEvent): void => {
      const x = (event.clientX / window.innerWidth - 0.5) * 24;
      const y = (event.clientY / window.innerHeight - 0.5) * 24;
      this.heroRoot.nativeElement.style.setProperty('--mouse-x', `${x}px`);
      this.heroRoot.nativeElement.style.setProperty('--mouse-y', `${y}px`);
    };

    window.addEventListener('mousemove', this.mouseHandler, { passive: true });
  }
}
