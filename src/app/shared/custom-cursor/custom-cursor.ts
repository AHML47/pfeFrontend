import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, OnDestroy, afterNextRender, viewChild } from '@angular/core';

declare global {
  interface Window {
    gsap?: {
      fromTo?: (...args: unknown[]) => void;
      to: (...args: unknown[]) => void;
      quickTo?: (target: Element, property: string, vars: Record<string, unknown>) => (value: number) => void;
    };
  }
}

@Component({
  selector: 'app-custom-cursor',
  standalone: true,
  imports: [CommonModule],
  template: '<div #cursor class="custom-cursor"></div>',
  styles: [
    `
      .custom-cursor {
        position: fixed;
        top: 0;
        left: 0;
        width: 14px;
        height: 14px;
        border-radius: 999px;
        pointer-events: none;
        z-index: 100;
        border: 1px solid rgba(230, 208, 163, 0.9);
        background: rgba(111, 130, 89, 0.18);
        box-shadow: 0 0 26px rgba(111, 130, 89, 0.65);
        backdrop-filter: blur(10px);
        mix-blend-mode: difference;
        transform: translate(-50%, -50%);
      }

      @media (hover: none), (pointer: coarse) {
        .custom-cursor {
          display: none;
        }
      }
    `
  ]
})
export class CustomCursorComponent implements OnDestroy {
  private readonly cursorRef = viewChild<ElementRef<HTMLDivElement>>('cursor');
  private quickX?: (value: number) => void;
  private quickY?: (value: number) => void;
  readonly isTouch = matchMedia('(hover: none), (pointer: coarse)').matches;

  constructor() {
    afterNextRender(() => {
      if (this.isTouch) return;
      const cursor = this.cursorRef()?.nativeElement;
      if (!cursor || !window.gsap) return;
      if (!window.gsap.quickTo) return;
      this.quickX = window.gsap.quickTo(cursor, 'x', { duration: 0.45, ease: 'power3.out' });
      this.quickY = window.gsap.quickTo(cursor, 'y', { duration: 0.45, ease: 'power3.out' });
    });
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    if (this.isTouch || !this.quickX || !this.quickY) return;
    this.quickX(event.clientX);
    this.quickY(event.clientY);
  }

  @HostListener('document:mouseover', ['$event'])
  onMouseOver(event: MouseEvent): void {
    if (this.isTouch) return;
    const target = event.target as HTMLElement | null;
    const cursor = this.cursorRef()?.nativeElement;
    if (!target || !cursor || !window.gsap) return;
    const interactive = target.closest('button, a');
    window.gsap.to(cursor, { scale: interactive ? 2.5 : 1, duration: 0.22, ease: 'power2.out' });
  }

  ngOnDestroy(): void {
    this.quickX = undefined;
    this.quickY = undefined;
  }
}
