import { Component, inject, signal, OnInit, OnDestroy, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { TranslationService } from '../../services/translation.service';
import { AudioService } from '../../services/audio.service';
import { FloatingPetalsComponent } from '../floating-petals/floating-petals.component';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, FloatingPetalsComponent],
  template: `
    <section class="hero-section" id="hero" aria-label="Wedding Hero">
      <!-- Background Subtle Glow & Elements -->
      <div class="hero-ambient-glow" aria-hidden="true"></div>
      <div class="hero-ambient-lights" aria-hidden="true"></div>
      
      <!-- Floating Petals Canvas Layer -->
      <app-floating-petals></app-floating-petals>

      <div class="hero-container">
        <!-- Main Ghibli Artwork Showcase Frame with 3D Depth & Holographic Gold Sheen -->
        <div 
          class="hero-artwork-col"
          (mousemove)="onCardMouseMove($event)"
          (mouseleave)="onCardMouseLeave()"
        >
          <!-- Ganesh Ji Invocation Medallion — first sacred visual, overlaid at the
                 top edge of the couple portrait so it's the very first thing guests see -->
            <div class="ganesh-medallion" aria-hidden="true">
              <img src="assets/images/ganesh ji image for invitation card.png" alt="" class="ganesh-medallion-img"/>
              <span class="ganesh-medallion-text">॥ श्री गणेशाय नमः ॥</span>
            </div>
          <div 
            class="artwork-arch-frame"
            [class.card-pressed]="isCardPressed()"
            [style.transform]="cardTransform()"
            (click)="onCardClick()"
            role="button"
            tabindex="0"
            (keydown.enter)="onCardClick()"
            aria-label="Palash & Sonam portrait"
          >
            <div class="arch-gold-trim" aria-hidden="true"></div>

            

            <picture class="hero-picture">
              <source srcset="assets/images/couple-ghibli.png" type="image/png">
              <img 
                src="assets/images/couple-ghibli.jpg" 
                [alt]="'Studio Ghibli style illustration of groom Palash and bride ' + brideName()" 
                class="hero-artwork-img"
                fetchpriority="high"
                loading="eager"
              />
            </picture>

            <!-- 3D Holographic Gold Glint / Sheen Overlay -->
            <div 
              class="gold-sheen-overlay" 
              [style.background]="sheenBackground()"
              aria-hidden="true"
            ></div>

            <!-- Warm cinematic vignette & lighting overlay -->
            <div class="artwork-cinematic-overlay" aria-hidden="true"></div>
            
            <!-- Soft Corner Ornaments -->
            <div class="corner-ornament top-left" aria-hidden="true"></div>
            <div class="corner-ornament top-right" aria-hidden="true"></div>
            <div class="corner-ornament bottom-left" aria-hidden="true"></div>
            <div class="corner-ornament bottom-right" aria-hidden="true"></div>
          </div>
        </div>

        <!-- Hero Typography & Call-To-Action -->
        <div class="hero-content-col" [style.transform]="textParallax()">
          <!-- Personalized Guest Welcome in Hero Banner -->
          <div *ngIf="guestName()" class="hero-guest-capsule">
            <span class="guest-salute-tag">✨ {{ isHindi() ? 'सादर आमंत्रित' : 'Cordially Inviting' }} ✨</span>
            <span class="guest-salute-name">{{ guestName() }}</span>
          </div>

          <div class="hero-badge">
            <span class="badge-diya" aria-hidden="true">🪔</span>
            <span class="badge-text">{{ t().hero.togetherWithFamilies }}</span>
            <span class="badge-diya" aria-hidden="true">🪔</span>
          </div>

          <div class="couple-names-wrapper">
            <h1 class="couple-name groom-name">
              {{ groomName() }}
            </h1>
            <div class="couple-ampersand-wrapper">
              <span class="golden-vines-left" aria-hidden="true"></span>
              <span class="ampersand">&</span>
              <span class="golden-vines-right" aria-hidden="true"></span>
            </div>
            <h1 class="couple-name bride-name">
              {{ brideName() }}
            </h1>
          </div>

          <div class="celebration-announcement">
            <p class="announcement-text">{{ t().hero.areGettingMarried }}</p>
            <div class="date-capsule">
              <svg class="calendar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              <span class="wedding-dates-text">{{ weddingDates() }}</span>
            </div>
          </div>

          <!-- Primary CTA Button -->
          <div class="cta-action-area">
            <button 
              type="button" 
              class="btn-royal view-invitation-btn" 
              (click)="onViewInvitationClick()"
              id="hero-view-invite-btn"
            >
              <span>{{ t().hero.viewInvitationBtn }}</span>
              <svg class="arrow-down-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <polyline points="19 12 12 19 5 12"></polyline>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Scroll Down Indicator -->
     <!-- <a href="#welcome" class="scroll-down-indicator" (click)="smoothScrollTo($event, 'welcome')" aria-label="Scroll to invitation message">
        <span class="scroll-hint-text">{{ t().hero.scrollHint }}</span>
        <div class="scroll-mouse" aria-hidden="true">
          <div class="scroll-wheel"></div>
        </div>
      </a> -->
    </section>
  `,
  styles: [`
    .hero-section {
      position: relative;
      min-height: 100vh;
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 5rem 1.5rem 4rem 1.5rem;
      background: radial-gradient(ellipse at center top, #FFF9F0 0%, #F8EFE3 55%, #EFE3D3 100%);
      overflow: hidden;
      perspective: 1200px;
    }

    .hero-ambient-glow {
      position: absolute;
      top: -10%;
      left: 50%;
      transform: translateX(-50%);
      width: 100%;
      max-width: 600px;
      height: 450px;
      background: radial-gradient(circle, rgba(243, 217, 159, 0.45) 0%, rgba(224, 185, 115, 0.15) 50%, transparent 75%);
      pointer-events: none;
      z-index: 1;
      filter: blur(40px);
      animation: pulseGlow 8s ease-in-out infinite alternate;
      will-change: transform;
    }

    .hero-ambient-lights {
      position: absolute;
      inset: 0;
      background-image: 
        radial-gradient(circle at 15% 20%, rgba(245, 166, 35, 0.12) 0%, transparent 25%),
        radial-gradient(circle at 85% 30%, rgba(235, 140, 155, 0.12) 0%, transparent 30%),
        radial-gradient(circle at 50% 85%, rgba(197, 160, 89, 0.15) 0%, transparent 40%);
      pointer-events: none;
      z-index: 1;
    }

    .hero-container {
      width: 100%;
      max-width: 1280px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 2rem;
      align-items: center;
      position: relative;
      z-index: 3;
    }

    @media (min-width: 1025px) {
      .hero-container {
        display: grid;
        grid-template-columns: 1.15fr 1fr;
        gap: 3.5rem;
      }
    }

    /* Artwork Column & Royal Arch Frame with Subtle 3D Depth */
    .hero-artwork-col {
      display: flex;
      flex-direction:column;
      justify-content: center;
      align-items: center;
      position: relative;
      width: 100%;
      perspective: 1000px;
    }

    .artwork-arch-frame {
      position: relative;
      width: 100%;
      max-width: 320px;
      margin: 0 auto;
      border-radius: 160px 160px 24px 24px;
      overflow: hidden;
      box-shadow: 
        0 24px 60px -12px rgba(80, 50, 20, 0.25),
        0 10px 28px -4px rgba(197, 160, 89, 0.3),
        inset 0 0 0 1px rgba(255, 255, 255, 0.85);
      border: 3.5px solid rgba(197, 160, 89, 0.65);
      background: #F8EFE3;
      transform-style: preserve-3d;
      transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.35s ease;
      will-change: transform;
      cursor: pointer;
    }

    .artwork-arch-frame.card-pressed {
      transform: perspective(1000px) scale3d(0.985, 0.985, 0.985) !important;
      box-shadow: 0 14px 35px -6px rgba(80, 50, 20, 0.35), inset 0 0 24px rgba(243, 217, 159, 0.45) !important;
      transition: transform 0.15s ease, box-shadow 0.15s ease !important;
    }

    .gold-sheen-overlay {
      position: absolute;
      inset: 0;
      pointer-events: none;
      z-index: 3;
      mix-blend-mode: overlay;
      transition: opacity 0.25s ease;
    }

    @media (min-width: 640px) {
      .artwork-arch-frame {
        max-width: 440px;
        border-radius: 220px 220px 28px 28px;
      }
    }

    @media (min-width: 1025px) {
      .artwork-arch-frame {
        max-width: 580px;
        border-radius: 280px 280px 32px 32px;
      }
    }

    .hero-picture {
      display: block;
      width: 100%;
      height: 100%;
    }

    /* Ganesh Ji Invocation Medallion — sits on top of the couple portrait */
    .ganesh-medallion {
      position: static;
      display:flex;
      flex-direction:column;
      align-items:center;
      margin-bottom:50px;
      margin-top: -40px;
      // left: 50%;
      // transform: translateX(-50%);
      // z-index: 6;
      // display: flex;
      // flex-direction: column;
      // align-items: center;
      gap: 3px;
      pointer-events: none;
      filter: drop-shadow(0 3px 8px rgba(70, 35, 15, 0.35));
    }

    .ganesh-medallion-img {
      width: 130px;
      height: 130px;
    }

    .ganesh-medallion-text {
      font-family: var(--font-heading, 'Cormorant Garamond', serif);
      font-size: 0.7rem;
      font-weight: 600;
      color: #7A192B;
      background: rgba(255, 251, 242, 0.92);
      padding: 2px 10px;
      border-radius: 999px;
      white-space: nowrap;
      letter-spacing: 0.01em;
    }

    @media (min-width: 640px) {
      .ganesh-medallion-img {
        width:130px;
        height: 130px;
      }

      .ganesh-medallion-text {
        font-size: 0.8rem;
      }
    }

    .hero-artwork-img {
      width: 100%;
      height: 100%;
      max-height: 380px;
      object-fit: cover;
      object-position: center top;
      display: block;
      transition: transform 1.2s ease;
    }

    @media (min-width: 640px) {
      .hero-artwork-img {
        max-height: 480px;
      }
    }

    @media (min-width: 1025px) {
      .hero-artwork-img {
        max-height: 600px;
      }
    }

    .artwork-cinematic-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(180deg, rgba(243, 217, 159, 0.08) 0%, transparent 60%, rgba(46, 26, 15, 0.35) 100%);
      pointer-events: none;
    }

    /* Corner Ornaments */
    .corner-ornament {
      position: absolute;
      width: 24px;
      height: 24px;
      border-color: #D4AF37;
      border-style: solid;
      pointer-events: none;
      opacity: 0.85;
    }
    .corner-ornament.top-left { top: 16px; left: 16px; border-width: 2px 0 0 2px; }
    .corner-ornament.top-right { top: 16px; right: 16px; border-width: 2px 2px 0 0; }
    .corner-ornament.bottom-left { bottom: 16px; left: 16px; border-width: 0 0 2px 2px; }
    .corner-ornament.bottom-right { bottom: 16px; right: 16px; border-width: 0 2px 2px 0; }

    /* Hero Content Column */
    .hero-content-col {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      padding: 1rem 0;
      transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
      will-change: transform;
    }

    /* Guest Banner */
    .hero-guest-capsule {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 18px;
      background: linear-gradient(135deg, rgba(243, 217, 159, 0.45) 0%, rgba(197, 160, 89, 0.25) 100%);
      border: 1.5px solid rgba(197, 160, 89, 0.7);
      border-radius: 9999px;
      box-shadow: 0 4px 14px rgba(197, 160, 89, 0.3);
      margin-bottom: 1rem;
      animation: floatGentle 4s ease-in-out infinite;
    }

    .guest-salute-tag {
      font-size: 0.8rem;
      font-weight: 700;
      color: #7A192B;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    .guest-salute-name {
      font-family: var(--font-heading);
      font-size: 1.15rem;
      font-weight: 700;
      color: #2E2520;
    }

    .hero-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 22px;
      background: rgba(255, 255, 255, 0.85);
      border: 1px solid rgba(197, 160, 89, 0.45);
      border-radius: 9999px;
      box-shadow: 0 4px 16px rgba(197, 160, 89, 0.15);
      margin-bottom: 1.25rem;
      backdrop-filter: blur(8px);
    }

    .badge-diya {
      font-size: 1.1rem;
    }

    .badge-text {
      font-size: 0.95rem;
      font-weight: 600;
      color: #7A192B;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    /* Couple Names */
    .couple-names-wrapper {
      margin-bottom: 1.5rem;
      width: 100%;
    }

    .couple-name {
      font-size: clamp(2.8rem, 5.5vw, 4.4rem);
      font-weight: 600;
      color: #7A192B;
      letter-spacing: 0.03em;
      line-height: 1.1;
      text-shadow: 0 2px 4px rgba(122, 25, 43, 0.08);
    }

    .couple-ampersand-wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 16px;
      margin: 0.35rem 0;
    }

    .golden-vines-left,
    .golden-vines-right {
      flex: 1;
      max-width: 80px;
      height: 1px;
      background: linear-gradient(90deg, transparent, #C5A059);
    }
    .golden-vines-right {
      background: linear-gradient(90deg, #C5A059, transparent);
    }

    .ampersand {
      font-family: 'Alex Brush', cursive;
      font-size: 3.2rem;
      color: #C5A059;
      line-height: 0.9;
    }

    /* Announcement & Date Capsule */
    .celebration-announcement {
      margin-bottom: 2.5rem;
    }

    .announcement-text {
      font-size: clamp(1.1rem, 2vw, 1.35rem);
      color: #54463E;
      font-style: italic;
      margin-bottom: 0.9rem;
      font-weight: 400;
    }

    .date-capsule {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      padding: 10px 24px;
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(247, 241, 230, 0.9) 100%);
      border: 1px solid rgba(197, 160, 89, 0.45);
      border-radius: 9999px;
      box-shadow: 0 6px 20px -4px rgba(44, 36, 32, 0.08);
    }

    .calendar-icon {
      width: 18px;
      height: 18px;
      color: #C5A059;
    }

    .wedding-dates-text {
      font-size: 1.05rem;
      font-weight: 600;
      color: #2E2520;
      letter-spacing: 0.04em;
    }

    /* CTA Area */
    .cta-action-area {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
    }

    .view-invitation-btn {
      font-size: 1.05rem;
      padding: 16px 40px;
      gap: 12px;
    }

    .arrow-down-icon {
      width: 20px;
      height: 20px;
      animation: floatGentle 2s ease-in-out infinite;
    }

    
    @media (max-width: 480px) {
      .hero-section {
        padding: 4rem 1rem 3rem 1rem;
      }

      .couple-name {
        font-size: 2.2rem;
      }

      .ampersand {
        font-size: 2.3rem;
      }

      .badge-text {
        font-size: 0.8rem;
      }

      .wedding-dates-text {
        font-size: 0.92rem;
      }

      .view-invitation-btn {
        width: 100%;
        max-width: 280px;
        padding: 12px 24px;
        font-size: 0.92rem;
      }
    }
  `]
})
export class HeroComponent implements OnInit, OnDestroy {
  private translationService = inject(TranslationService);
  private audioService = inject(AudioService);
  private platformId = inject(PLATFORM_ID);

  public readonly t = this.translationService.t;
  public readonly isHindi = this.translationService.isHindi;
  public readonly guestName = this.translationService.guestName;
  public readonly groomName = this.translationService.groomName;
  public readonly brideName = this.translationService.brideName;
  public readonly weddingDates = this.translationService.weddingDates;

  public cardTransform = signal<string>('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
  public textParallax = signal<string>('translate3d(0, 0, 0)');
  public sheenBackground = signal<string>('radial-gradient(circle at 50% 50%, rgba(255, 235, 175, 0) 0%, transparent 60%)');
  public isCardPressed = signal<boolean>(false);

  private isBrowser = false;

  constructor(private adSer: AudioService) {
    this.adSer.initAudio()
    this.adSer.tryAutoplay()
  }

  ngOnInit(): void {

    this.isBrowser = isPlatformBrowser(this.platformId);
    if (!this.isBrowser) return;

    // Mobile device orientation subtle tilt reflection
    const isTouch = 'ontouchstart' in window || (navigator.maxTouchPoints && navigator.maxTouchPoints > 0);
    const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (isTouch && !prefersReducedMotion && typeof window !== 'undefined' && 'DeviceOrientationEvent' in window) {
      window.addEventListener('deviceorientation', this.onDeviceOrientation, { passive: true });
    }
  }

  private onDeviceOrientation = (e: DeviceOrientationEvent) => {
    if (e.gamma === null || e.beta === null) return;

    const gamma = Math.max(-25, Math.min(25, e.gamma));
    const beta = Math.max(15, Math.min(65, e.beta)) - 40;

    const rotateY = (gamma / 25) * 2.2;
    const rotateX = (beta / 25) * -2.2;

    const sheenX = Math.round(50 + (gamma / 25) * 35);
    const sheenY = Math.round(50 + (beta / 25) * 35);

    this.cardTransform.set(`perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.01, 1.01, 1.01)`);
    this.sheenBackground.set(`radial-gradient(circle at ${sheenX}% ${sheenY}%, rgba(255, 240, 195, 0.4) 0%, rgba(245, 185, 55, 0.12) 35%, transparent 65%)`);
  };

  public onCardClick(): void {
    this.isCardPressed.set(true);
    this.sheenBackground.set('radial-gradient(circle at 50% 50%, rgba(255, 245, 210, 0.6) 0%, rgba(245, 185, 55, 0.3) 40%, transparent 70%)');
    setTimeout(() => {
      this.isCardPressed.set(false);
      this.sheenBackground.set('radial-gradient(circle at 50% 50%, rgba(255, 235, 175, 0) 0%, transparent 60%)');
    }, 280);
  }

  public onCardMouseMove(e: MouseEvent): void {
    // Only on desktop fine pointer
    if (window.matchMedia && !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const target = e.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Subtle luxury 3D tilt: max 2.2 degrees
    const rotateX = ((y - centerY) / centerY) * -2.2;
    const rotateY = ((x - centerX) / centerX) * 2.2;

    // Very subtle text parallax (1.5px max)
    const textMoveX = ((x - centerX) / centerX) * 2;
    const textMoveY = ((y - centerY) / centerY) * 1.5;

    const sheenX = Math.round((x / rect.width) * 100);
    const sheenY = Math.round((y / rect.height) * 100);

    this.cardTransform.set(`perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.015, 1.015, 1.015)`);
    this.textParallax.set(`translate3d(${textMoveX.toFixed(1)}px, ${textMoveY.toFixed(1)}px, 0)`);
    this.sheenBackground.set(`radial-gradient(circle at ${sheenX}% ${sheenY}%, rgba(255, 240, 195, 0.4) 0%, rgba(245, 185, 55, 0.12) 35%, transparent 65%)`);
  }

  public onCardMouseLeave(): void {
    this.cardTransform.set('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
    this.textParallax.set('translate3d(0, 0, 0)');
    this.sheenBackground.set('radial-gradient(circle at 50% 50%, rgba(255, 235, 175, 0) 0%, transparent 60%)');
  }

  public onViewInvitationClick(): void {
    // 1. Attempt to start background music
    this.audioService.play();

    // 2. Smoothly scroll to invitation welcome section
    const target = document.getElementById('welcome');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  }

  public smoothScrollTo(event: MouseEvent, elementId: string): void {
    event.preventDefault();
    const target = document.getElementById(elementId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  }

  ngOnDestroy(): void {
    if (this.isBrowser && typeof window !== 'undefined') {
      window.removeEventListener('deviceorientation', this.onDeviceOrientation);
    }
  }
}
