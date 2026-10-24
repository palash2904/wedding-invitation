import { Directive, ElementRef, HostListener, Input, OnInit, OnDestroy, inject, NgZone, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Directive({
  selector: '[appCard3dTilt]',
  standalone: true
})
export class Card3dTiltDirective implements OnInit, OnDestroy {
  @Input() maxTilt = 2.5; // Subtle luxury tilt (degrees)
  @Input() perspective = 1000;
  @Input() scale = 1.015;
  @Input() speed = 400; // Transition return speed ms

  private el = inject(ElementRef<HTMLElement>);
  private ngZone = inject(NgZone);
  private platformId = inject(PLATFORM_ID);

  private isEnabled = false;
  private rafId: number | null = null;
  private targetRotateX = 0;
  private targetRotateY = 0;
  private isHovered = false;

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    // Only enable on desktop devices with hover & fine pointer + without reduced motion
    const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isFinePointer = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    if (!prefersReducedMotion && isFinePointer) {
      this.isEnabled = true;
      const element = this.el.nativeElement;
      element.style.transformStyle = 'preserve-3d';
      element.style.transition = `transform ${this.speed}ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow ${this.speed}ms cubic-bezier(0.16, 1, 0.3, 1)`;
      element.style.willChange = 'transform';
    }
  }

  @HostListener('mouseenter')
  onMouseEnter(): void {
    if (!this.isEnabled) return;
    this.isHovered = true;
    this.el.nativeElement.style.transition = 'transform 0.12s ease-out, box-shadow 0.3s ease';
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(e: MouseEvent): void {
    if (!this.isEnabled) return;

    const rect = this.el.nativeElement.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    this.targetRotateX = ((y - centerY) / centerY) * -this.maxTilt;
    this.targetRotateY = ((x - centerX) / centerX) * this.maxTilt;

    if (this.rafId === null) {
      this.ngZone.runOutsideAngular(() => {
        this.rafId = requestAnimationFrame(() => {
          this.applyTransform();
          this.rafId = null;
        });
      });
    }
  }

  @HostListener('mouseleave')
  onMouseLeave(): void {
    if (!this.isEnabled) return;
    this.isHovered = false;
    const element = this.el.nativeElement;
    element.style.transition = `transform ${this.speed}ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow ${this.speed}ms cubic-bezier(0.16, 1, 0.3, 1)`;
    element.style.transform = `perspective(${this.perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
  }

  private applyTransform(): void {
    if (!this.isHovered) return;
    const element = this.el.nativeElement;
    element.style.transform = `perspective(${this.perspective}px) rotateX(${this.targetRotateX.toFixed(2)}deg) rotateY(${this.targetRotateY.toFixed(2)}deg) scale3d(${this.scale}, ${this.scale}, 1)`;
  }

  ngOnDestroy(): void {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
    }
  }
}
