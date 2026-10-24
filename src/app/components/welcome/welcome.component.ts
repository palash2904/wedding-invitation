import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationService } from '../../services/translation.service';
import { ScrollRevealDirective } from '../../directives/scroll-reveal.directive';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [CommonModule, ScrollRevealDirective],
  template: `
    <section class="section-wrapper welcome-section" id="welcome" aria-label="Welcome Invitation">
      <!-- Decorative Background Motifs -->
      <div class="bg-ornament bg-ornament-left" aria-hidden="true"></div>
      <div class="bg-ornament bg-ornament-right" aria-hidden="true"></div>

      <div class="content-container">
        <div class="welcome-card luxury-card" appScrollReveal>
          <!-- Top Royal Mandala Motif SVG -->
          <div class="mandala-header" aria-hidden="true">
            <svg class="mandala-svg" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="45" stroke="#C5A059" stroke-width="1.2" stroke-dasharray="2 3"/>
              <circle cx="50" cy="50" r="36" stroke="#C5A059" stroke-width="0.8"/>
              <circle cx="50" cy="50" r="28" stroke="#D4AF37" stroke-width="1.2"/>
              <circle cx="50" cy="50" r="8" fill="#C5A059" opacity="0.3"/>
              <circle cx="50" cy="50" r="4" fill="#7A192B"/>
              <!-- Petals -->
              <path d="M50 14 C54 26 54 34 50 42 C46 34 46 26 50 14 Z" fill="#C5A059" opacity="0.6"/>
              <path d="M50 86 C54 74 54 66 50 58 C46 66 46 74 50 86 Z" fill="#C5A059" opacity="0.6"/>
              <path d="M14 50 C26 54 34 54 42 50 C34 46 26 46 14 50 Z" fill="#C5A059" opacity="0.6"/>
              <path d="M86 50 C74 54 66 54 58 50 C66 46 74 46 86 50 Z" fill="#C5A059" opacity="0.6"/>
              <!-- Diagonal Petals -->
              <path d="M24.5 24.5 C34 32 40 38 44 44 C38 40 32 34 24.5 24.5 Z" fill="#D4AF37" opacity="0.5"/>
              <path d="M75.5 24.5 C66 32 60 38 56 44 C62 40 68 34 75.5 24.5 Z" fill="#D4AF37" opacity="0.5"/>
              <path d="M24.5 75.5 C34 68 40 62 44 56 C38 60 32 66 24.5 75.5 Z" fill="#D4AF37" opacity="0.5"/>
              <path d="M75.5 75.5 C66 68 60 62 56 56 C62 60 68 66 75.5 75.5 Z" fill="#D4AF37" opacity="0.5"/>
            </svg>
          </div>

          <!-- Personalized Guest Welcome (If ?guest= or ?name= in URL) -->
          <div *ngIf="guestName()" class="guest-welcome-capsule">
            <span class="guest-salutation">{{ isHindi() ? 'सादर आमंत्रण' : 'Cordially Invited' }}</span>
            <h3 class="guest-name-title">{{ guestName() }}</h3>
          </div>

          <div class="welcome-header">
            <span class="welcome-tag">
              <span class="diya-glow">🪔</span>
              {{ t().welcome.subheading }}
              <span class="diya-glow">🪔</span>
            </span>
            <h2 class="welcome-title">{{ t().welcome.heading }}</h2>
          </div>

          <!-- Gold Line Divider -->
          <div class="gold-divider" aria-hidden="true">
            <span class="divider-motif">❧ ✦ ☙</span>
          </div>

          <div class="welcome-body">
            <p class="welcome-main-text">
              {{ t().welcome.message }}
            </p>
            <p class="welcome-blessing-text">
              {{ t().welcome.blessing }}
            </p>
          </div>

          <!-- Couple Signoff in Welcome Card -->
          <div class="welcome-signoff">
            <span class="signoff-with-love">{{ t().closing.withLove }}</span>
            <h3 class="signoff-names">{{ groomName() }} & {{ brideName() }}</h3>
          </div>

          <!-- Bottom Floral Border -->
          <div class="card-bottom-flourish" aria-hidden="true">
            <svg viewBox="0 0 300 24" fill="none" class="flourish-svg">
              <path d="M0 12 Q75 22 150 12 Q225 2 300 12" stroke="#C5A059" stroke-width="1.2" opacity="0.5"/>
              <circle cx="150" cy="12" r="3" fill="#7A192B"/>
              <circle cx="120" cy="14" r="2" fill="#C5A059"/>
              <circle cx="180" cy="10" r="2" fill="#C5A059"/>
            </svg>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .welcome-section {
      background: linear-gradient(180deg, #FDFBF7 0%, #FAF6EE 50%, #F6EFE3 100%);
      overflow: hidden;
      position: relative;
    }

    .bg-ornament {
      position: absolute;
      width: 320px;
      height: 320px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(197, 160, 89, 0.08) 0%, transparent 70%);
      pointer-events: none;
    }

    .bg-ornament-left {
      top: 10%;
      left: -80px;
    }

    .bg-ornament-right {
      bottom: 10%;
      right: -80px;
    }

    .welcome-card {
      max-width: 860px;
      margin: 0 auto;
      padding: 4rem 3rem;
      text-align: center;
      background: rgba(255, 255, 255, 0.92);
      border: 2px solid rgba(197, 160, 89, 0.35);
      border-radius: 32px;
      box-shadow: 0 20px 50px -10px rgba(122, 25, 43, 0.08), 0 8px 25px rgba(197, 160, 89, 0.12);
      position: relative;
    }

    .mandala-header {
      width: 72px;
      height: 72px;
      margin: 0 auto 1.5rem auto;
      animation: floatGentle 4s ease-in-out infinite;
    }

    .mandala-svg {
      width: 100%;
      height: 100%;
    }

    .welcome-tag {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      font-size: 0.88rem;
      color: #7A192B;
      font-weight: 600;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      margin-bottom: 0.75rem;
    }

    .diya-glow {
      font-size: 1.1rem;
      filter: drop-shadow(0 0 6px rgba(245, 166, 35, 0.6));
    }

    .welcome-title {
      font-size: clamp(2.2rem, 4vw, 3.2rem);
      color: #7A192B;
      font-weight: 600;
      margin-bottom: 0.5rem;
    }

    .welcome-body {
      max-width: 680px;
      margin: 1.75rem auto 2.25rem auto;
    }

    .welcome-main-text {
      font-size: clamp(1.15rem, 2vw, 1.35rem);
      line-height: 1.8;
      color: #2E2520;
      font-weight: 400;
      margin-bottom: 1rem;
    }

    .welcome-blessing-text {
      font-size: 1.05rem;
      color: #6E6259;
      font-style: italic;
      line-height: 1.7;
    }

    .welcome-signoff {
      margin-top: 2rem;
      padding-top: 1.5rem;
      border-top: 1px dashed rgba(197, 160, 89, 0.35);
    }

    .signoff-with-love {
      font-family: 'Alex Brush', cursive;
      font-size: 2rem;
      color: #C5A059;
      display: block;
      line-height: 1;
      margin-bottom: 0.25rem;
    }

    .signoff-names {
      font-size: 1.6rem;
      color: #7A192B;
      font-weight: 600;
      letter-spacing: 0.04em;
    }

    .card-bottom-flourish {
      width: 100%;
      max-width: 240px;
      margin: 1.5rem auto 0 auto;
    }

    .flourish-svg {
      width: 100%;
      height: 100%;
    }

    .guest-welcome-capsule {
      display: inline-flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      padding: 10px 28px;
      margin-bottom: 1.5rem;
      background: linear-gradient(135deg, rgba(243, 217, 159, 0.35) 0%, rgba(197, 160, 89, 0.2) 100%);
      border: 1.5px solid rgba(197, 160, 89, 0.6);
      border-radius: 9999px;
      box-shadow: 0 4px 16px rgba(197, 160, 89, 0.25);
    }

    .guest-salutation {
      font-size: 0.8rem;
      font-weight: 600;
      color: #7A192B;
      text-transform: uppercase;
      letter-spacing: 0.12em;
    }

    .guest-name-title {
      font-family: var(--font-heading);
      font-size: clamp(1.3rem, 2.5vw, 1.7rem);
      font-weight: 700;
      color: #2E2520;
      margin: 0;
    }

    @media (max-width: 640px) {
      .welcome-card {
        padding: 2.75rem 1.25rem 2rem 1.25rem;
        border-radius: 24px;
      }

      .mandala-header {
        width: 52px;
        height: 52px;
        margin-bottom: 1rem;
      }

      .welcome-main-text {
        font-size: 1.05rem;
      }

      .guest-welcome-capsule {
        padding: 8px 18px;
      }

      .guest-name-title {
        font-size: 1.35rem;
      }
    }

    @media (max-width: 480px) {
      .welcome-card {
        padding: 2.25rem 1rem 1.75rem 1rem;
        border-radius: 20px;
      }

      .welcome-title {
        font-size: 1.75rem;
      }

      .welcome-main-text {
        font-size: 0.98rem;
        line-height: 1.7;
      }

      .welcome-blessing-text {
        font-size: 0.9rem;
      }

      .signoff-names {
        font-size: 1.4rem;
      }
    }
  `]
})
export class WelcomeComponent {
  private translationService = inject(TranslationService);

  public readonly t = this.translationService.t;
  public readonly isHindi = this.translationService.isHindi;
  public readonly guestName = this.translationService.guestName;
  public readonly groomName = this.translationService.groomName;
  public readonly brideName = this.translationService.brideName;
}
