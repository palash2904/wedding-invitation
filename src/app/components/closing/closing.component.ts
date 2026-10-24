import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationService } from '../../services/translation.service';
import { ScrollRevealDirective } from '../../directives/scroll-reveal.directive';

@Component({
  selector: 'app-closing',
  standalone: true,
  imports: [CommonModule, ScrollRevealDirective],
  template: `
    <section class="section-wrapper closing-section" id="closing" aria-label="Final Invitation">
      <!-- Background Radiance -->
      <div class="closing-radiance" aria-hidden="true"></div>

      <div class="content-container">
        <div class="closing-card luxury-card" appScrollReveal>
          <!-- Circular Miniature Ghibli Cameo Frame -->
          <div class="cameo-frame-wrapper">
            <div class="cameo-gold-ring" aria-hidden="true"></div>
            <img 
              src="assets/images/couple-cameo.png" 
              [alt]="groomName() + ' and ' + brideName() + ' portrait cameo'" 
              class="cameo-img"
              loading="lazy"
            />
          </div>

          <div class="closing-header">
            <span class="closing-badge">
              <span class="diya">🪔</span>
              {{ t().closing.saveTheDate }}
              <span class="diya">🪔</span>
            </span>
            <h2 class="closing-title">
              <ng-container *ngIf="guestName()">
                {{ isHindi() ? guestName() + ', इस शुभ अवसर पर आपकी गरिमामयी उपस्थिति की हमें हार्दिक प्रतीक्षा रहेगी' : guestName() + ', we can’t wait to celebrate with you' }}
              </ng-container>
              <ng-container *ngIf="!guestName()">
                {{ t().closing.heading }}
              </ng-container>
            </h2>
            <p class="closing-subtitle">{{ t().closing.subheading }}</p>
          </div>

          <!-- Decorative Floral Garland Divider -->
          <div class="garland-divider" aria-hidden="true">
            <svg viewBox="0 0 340 30" fill="none" class="garland-svg">
              <path d="M10 15 Q 90 28, 170 15 T 330 15" stroke="#C5A059" stroke-width="1.5" stroke-linecap="round"/>
              <circle cx="170" cy="15" r="4" fill="#7A192B"/>
              <circle cx="90" cy="21" r="3" fill="#F5A623"/>
              <circle cx="250" cy="21" r="3" fill="#F5A623"/>
              <circle cx="50" cy="18" r="2.5" fill="#CE8683"/>
              <circle cx="290" cy="18" r="2.5" fill="#CE8683"/>
            </svg>
          </div>

          <div class="closing-dates-pill">
            <svg class="calendar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            <span class="dates-text">{{ weddingDates() }}</span>
          </div>

          <!-- Signature Signoff -->
          <div class="closing-signature-block">
            <span class="with-love-script">{{ t().closing.withLove }}</span>
            <h3 class="couple-signature-names">
              {{ groomName() }} & {{ brideName() }}
            </h3>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .closing-section {
      background: linear-gradient(180deg, #F8EFE3 0%, #FAF6EF 50%, #F5ECDD 100%);
      position: relative;
      overflow: hidden;
      max-width: 100vw;
      padding-top: 7rem;
    }

    .closing-radiance {
      position: absolute;
      bottom: -150px;
      left: 50%;
      transform: translateX(-50%);
      width: 100%;
      max-width: 600px;
      height: 450px;
      background: radial-gradient(circle, rgba(243, 217, 159, 0.35) 0%, rgba(224, 185, 115, 0.1) 60%, transparent 80%);
      pointer-events: none;
      filter: blur(40px);
    }

    .closing-card {
      max-width: 820px;
      margin: 0 auto;
      padding: 5rem 3rem 4rem 3rem;
      text-align: center;
      background: rgba(255, 255, 255, 0.94);
      border: 2px solid rgba(197, 160, 89, 0.4);
      border-radius: 36px;
      box-shadow: 0 24px 60px -10px rgba(122, 25, 43, 0.12), 0 8px 30px rgba(197, 160, 89, 0.15);
      position: relative;
      overflow: visible !important;
    }

    /* Cameo Frame */
    .cameo-frame-wrapper {
      position: relative;
      z-index: 10;
      width: 150px;
      height: 150px;
      margin: -8.25rem auto 1.75rem auto;
      border-radius: 50%;
      padding: 6px;
      background: linear-gradient(135deg, #F3D99F 0%, #C5A059 50%, #9B7733 100%);
      box-shadow: 0 16px 36px rgba(122, 25, 43, 0.24), 0 6px 18px rgba(197, 160, 89, 0.4);
      transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease;
      cursor: pointer;
      -webkit-tap-highlight-color: transparent;
    }

    .cameo-frame-wrapper:hover {
      transform: scale(1.06) translateY(-2px);
      box-shadow: 0 22px 46px rgba(122, 25, 43, 0.3), 0 8px 24px rgba(197, 160, 89, 0.5);
    }

    .cameo-frame-wrapper:active {
      transform: scale(0.98) translateY(0px) !important;
      box-shadow: 0 10px 24px rgba(122, 25, 43, 0.3) !important;
      transition: transform 0.15s ease, box-shadow 0.15s ease;
    }


    .cameo-img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      object-fit: cover;
      object-position: center center;
      border: 3px solid #FFFFFF;
      display: block;
      transition: transform 0.6s ease;
    }

    .cameo-frame-wrapper:hover .cameo-img {
      transform: scale(1.04);
    }

    .closing-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 18px;
      background: rgba(247, 241, 230, 0.85);
      border: 1px solid rgba(197, 160, 89, 0.4);
      border-radius: 9999px;
      font-size: 0.85rem;
      font-weight: 600;
      color: #7A192B;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      margin-bottom: 1.25rem;
    }

    .closing-title {
      font-size: clamp(2rem, 4vw, 3rem);
      color: #7A192B;
      font-weight: 700;
      line-height: 1.2;
      margin-bottom: 0.5rem;
    }

    .closing-subtitle {
      font-size: 1.1rem;
      color: #6E6259;
      font-style: italic;
    }

    .garland-divider {
      width: 100%;
      max-width: 320px;
      margin: 1.5rem auto;
    }

    .garland-svg {
      width: 100%;
      height: 100%;
    }

    .closing-dates-pill {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      padding: 10px 24px;
      background: linear-gradient(135deg, rgba(243, 217, 159, 0.25) 0%, rgba(197, 160, 89, 0.15) 100%);
      border: 1px solid rgba(197, 160, 89, 0.45);
      border-radius: 9999px;
      margin-bottom: 2rem;
    }

    .calendar-icon {
      width: 18px;
      height: 18px;
      color: #7A192B;
    }

    .dates-text {
      font-size: 1.05rem;
      font-weight: 700;
      color: #2E2520;
      letter-spacing: 0.04em;
    }

    .closing-signature-block {
      margin-top: 1rem;
    }

    .with-love-script {
      font-family: 'Alex Brush', cursive;
      font-size: 2.6rem;
      color: #C5A059;
      display: block;
      line-height: 0.9;
    }

    .couple-signature-names {
      font-size: clamp(1.8rem, 3.2vw, 2.4rem);
      color: #7A192B;
      font-weight: 600;
      letter-spacing: 0.04em;
    }

    @media (max-width: 640px) {
      .closing-section {
        padding-top: 5.5rem;
      }

      .closing-card {
        padding: 4.5rem 1.25rem 2.25rem 1.25rem;
        border-radius: 24px;
      }

      .cameo-frame-wrapper {
        width: 120px;
        height: 120px;
        margin-top: -6.75rem;
      }

      .closing-title {
        font-size: 1.8rem;
      }

      .closing-subtitle {
        font-size: 0.95rem;
      }

      .closing-dates-pill {
        padding: 8px 18px;
        margin-bottom: 1.5rem;
      }

      .dates-text {
        font-size: 0.95rem;
      }

      .with-love-script {
        font-size: 2.2rem;
      }

      .couple-signature-names {
        font-size: 1.7rem;
      }
    }

    @media (max-width: 480px) {
      .closing-card {
        padding: 4.25rem 1rem 1.75rem 1rem;
        border-radius: 20px;
      }

      .cameo-frame-wrapper {
        width: 110px;
        height: 110px;
        margin-top: -6.25rem;
      }

      .closing-title {
        font-size: 1.55rem;
      }

      .dates-text {
        font-size: 0.88rem;
      }

      .couple-signature-names {
        font-size: 1.5rem;
      }
    }
  `]
})
export class ClosingComponent {
  private translationService = inject(TranslationService);

  public readonly t = this.translationService.t;
  public readonly isHindi = this.translationService.isHindi;
  public readonly guestName = this.translationService.guestName;
  public readonly groomName = this.translationService.groomName;
  public readonly brideName = this.translationService.brideName;
  public readonly weddingDates = this.translationService.weddingDates;
}
