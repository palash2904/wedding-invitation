import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationService } from '../../services/translation.service';
import { Card3dTiltDirective } from '../../directives/card-3d-tilt.directive';
import { ScrollRevealDirective } from '../../directives/scroll-reveal.directive';

@Component({
  selector: 'app-highlight',
  standalone: true,
  imports: [CommonModule, Card3dTiltDirective, ScrollRevealDirective],
  template: `
    <section class="highlight-section" id="highlight" aria-label="Romantic Highlight">
      <!-- Panoramic Background with Slow Zoom Animation -->
      <div class="highlight-bg-wrapper" aria-hidden="true">
        <img 
          src="assets/images/palace-highlight.jpg" 
          alt="Palace lakeside golden hour sunset" 
          class="highlight-bg-img"
          loading="lazy"
        />
        <div class="highlight-gradient-overlay"></div>
      </div>

      <div class="content-container highlight-content">
        <div class="highlight-glass-card" appScrollReveal appCard3dTilt [maxTilt]="1.5" [scale]="1.01">
          <span class="highlight-pretitle">
            <span class="sparkle">✦</span>
            {{ t().highlight.subheading }}
            <span class="sparkle">✦</span>
          </span>

          <h2 class="highlight-main-title">
            {{ t().highlight.heading }}
          </h2>

          <div class="gold-divider" aria-hidden="true">
            <span class="divider-motif">🪔 ✦ 🪔</span>
          </div>

          <!-- Highlight Dates Banner -->
          <div class="highlight-dates-container">
            <ng-container *ngIf="activeConfig().type === 'both'">
              <div class="date-block">
                <span class="day-number">30</span>
                <span class="month-name">{{ isHindi() ? 'नवंबर' : 'November' }}</span>
              </div>
              <div class="dates-ampersand">&</div>
              <div class="date-block">
                <span class="day-number">01</span>
                <span class="month-name">{{ isHindi() ? 'दिसंबर' : 'December' }}</span>
              </div>
            </ng-container>

            <ng-container *ngIf="activeConfig().type === 'dec1'">
              <div class="date-block">
                <span class="day-number">{{ isHindi() ? 'मंगल' : 'TUE' }}</span>
                <span class="month-name">{{ isHindi() ? 'मंगलवार' : 'Tuesday' }}</span>
              </div>
              <div class="dates-ampersand">✦</div>
              <div class="date-block">
                <span class="day-number">01</span>
                <span class="month-name">{{ isHindi() ? 'दिसंबर' : 'December' }}</span>
              </div>
            </ng-container>

            <ng-container *ngIf="activeConfig().type === 'reception'">
              <div class="date-block">
                <span class="day-number">7:00</span>
                <span class="month-name">{{ isHindi() ? 'सायं ०७:०० बजे से' : 'PM Onwards' }}</span>
              </div>
              <div class="dates-ampersand">✦</div>
              <div class="date-block">
                <span class="day-number">01</span>
                <span class="month-name">{{ isHindi() ? 'दिसंबर' : 'December' }}</span>
              </div>
            </ng-container>

            <div class="year-block">
              <span class="year-text">{{ isHindi() ? '२०२६' : '2026' }}</span>
            </div>
          </div>

          <p class="highlight-tagline">
            {{ isHindi() ? activeConfig().highlightTaglineHi : activeConfig().highlightTaglineEn }}
          </p>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .highlight-section {
      position: relative;
      min-height: 85vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 6rem 1.5rem;
      overflow: hidden;
    }

    .highlight-bg-wrapper {
      position: absolute;
      inset: 0;
      z-index: 1;
      overflow: hidden;
    }

    .highlight-bg-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center;
      animation: slowZoom 24s ease-in-out infinite alternate;
    }

    .highlight-gradient-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(
        180deg,
        rgba(26, 18, 14, 0.45) 0%,
        rgba(122, 25, 43, 0.55) 50%,
        rgba(26, 18, 14, 0.75) 100%
      );
    }

    .highlight-content {
      position: relative;
      z-index: 3;
      display: flex;
      justify-content: center;
      width: 100%;
    }

    .highlight-glass-card {
      background: rgba(255, 255, 255, 0.18);
      backdrop-filter: blur(18px);
      -webkit-backdrop-filter: blur(18px);
      border: 1px solid rgba(255, 255, 255, 0.4);
      border-radius: 36px;
      padding: 4rem 3.5rem;
      max-width: 860px;
      text-align: center;
      box-shadow: 0 30px 60px rgba(0, 0, 0, 0.3), inset 0 0 0 1px rgba(255, 255, 255, 0.2);
    }

    .highlight-pretitle {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      color: #F8EFE3;
      font-size: 0.95rem;
      font-weight: 500;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      margin-bottom: 1.25rem;
    }

    .sparkle {
      color: #F3D99F;
    }

    .highlight-main-title {
      font-size: clamp(2.4rem, 4.8vw, 3.8rem);
      color: #FFFFFF;
      font-weight: 700;
      line-height: 1.15;
      text-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
      margin-bottom: 0.5rem;
    }

    /* Dates Presentation */
    .highlight-dates-container {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1.5rem;
      margin: 2.25rem 0;
      flex-wrap: wrap;
    }

    .date-block {
      display: flex;
      flex-direction: column;
      align-items: center;
      background: rgba(0, 0, 0, 0.35);
      border: 1px solid rgba(243, 217, 159, 0.5);
      border-radius: 18px;
      padding: 12px 24px;
      min-width: 120px;
    }

    .day-number {
      font-family: var(--font-heading);
      font-size: 2.6rem;
      font-weight: 700;
      color: #F3D99F;
      line-height: 1;
    }

    .month-name {
      font-size: 0.85rem;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: #FFF9F0;
      font-weight: 500;
    }

    .dates-ampersand {
      font-family: 'Alex Brush', cursive;
      font-size: 3rem;
      color: #F3D99F;
    }

    .year-block {
      display: flex;
      align-items: center;
      background: linear-gradient(135deg, #F3D99F 0%, #C5A059 100%);
      color: #1A130C;
      padding: 12px 22px;
      border-radius: 18px;
      font-family: var(--font-heading);
      font-size: 1.8rem;
      font-weight: 700;
      box-shadow: 0 4px 14px rgba(0, 0, 0, 0.25);
    }

    .highlight-tagline {
      font-size: clamp(1.05rem, 2vw, 1.25rem);
      color: #FAF4EB;
      font-style: italic;
      line-height: 1.7;
      max-width: 620px;
      margin: 0 auto;
      text-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
    }

    @media (max-width: 768px) {
      .highlight-section {
        min-height: 65vh;
        padding: 4rem 1rem;
      }

      .highlight-glass-card {
        padding: 2.25rem 1.25rem;
        border-radius: 24px;
      }

      .highlight-dates-container {
        gap: 0.85rem;
      }

      .date-block {
        padding: 8px 14px;
        min-width: 90px;
        border-radius: 14px;
      }

      .day-number {
        font-size: 2rem;
      }

      .dates-ampersand {
        font-size: 2.2rem;
      }

      .year-block {
        font-size: 1.25rem;
        padding: 8px 14px;
        border-radius: 14px;
      }
    }

    @media (max-width: 480px) {
      .highlight-main-title {
        font-size: 1.85rem;
      }

      .highlight-dates-container {
        gap: 0.5rem;
      }

      .date-block {
        padding: 6px 10px;
        min-width: 75px;
      }

      .day-number {
        font-size: 1.7rem;
      }

      .month-name {
        font-size: 0.72rem;
      }

      .dates-ampersand {
        font-size: 1.8rem;
      }

      .year-block {
        font-size: 1.1rem;
        padding: 6px 12px;
      }

      .highlight-tagline {
        font-size: 0.95rem;
      }
    }
  `]
})
export class HighlightComponent {
  private translationService = inject(TranslationService);

  public readonly t = this.translationService.t;
  public readonly isHindi = this.translationService.isHindi;
  public readonly activeConfig = this.translationService.activeConfig;
}
