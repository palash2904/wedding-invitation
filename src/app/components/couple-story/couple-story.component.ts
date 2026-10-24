import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationService } from '../../services/translation.service';
import { Card3dTiltDirective } from '../../directives/card-3d-tilt.directive';
import { ScrollRevealDirective } from '../../directives/scroll-reveal.directive';

@Component({
  selector: 'app-couple-story',
  standalone: true,
  imports: [CommonModule, Card3dTiltDirective, ScrollRevealDirective],
  template: `
    <section class="section-wrapper story-section" id="story" aria-label="Our Beautiful Journey">
      <!-- Ambient Decorative background shapes -->
      <div class="story-bg-glow" aria-hidden="true"></div>

      <div class="content-container">
        <!-- Section Header -->
        <div class="section-header" appScrollReveal>
          <span class="section-tag">
            <span class="heart-icon" aria-hidden="true">💖</span>
            {{ t().story.subheading }}
          </span>
          <h2 class="section-title">{{ t().story.heading }}</h2>
          <div class="gold-divider" aria-hidden="true">
            <span class="divider-motif">❧ ❦ ☙</span>
          </div>
        </div>

        <!-- Magazine Editorial Layout -->
        <div class="magazine-grid">
          <!-- Left Column: Primary Portrait & Quote -->
          <div class="magazine-col-primary" appScrollReveal>
            <div class="photo-frame-primary" appCard3dTilt [maxTilt]="1.8" [scale]="1.015">
              <div class="gold-frame-border" aria-hidden="true"></div>
              <img 
                src="assets/images/couple-1.jpg" 
                alt="Palash and his bride walking hand in hand in the royal palace garden at twilight" 
                class="story-photo-img"
                loading="lazy"
              />
              <div class="photo-badge-caption">
                <span class="caption-tag">{{ t().story.captions.oneJourney }}</span>
              </div>
            </div>

            <div class="story-narrative-card luxury-card" appCard3dTilt [maxTilt]="1.5" [scale]="1.01">
              <p class="story-paragraph">
                {{ t().story.description1 }}
              </p>
            </div>
          </div>

          <!-- Right Column: Secondary Overlapping Portrait, Romantic Polaroids & Quotes -->
          <div class="magazine-col-secondary" appScrollReveal>
            <div class="polaroid-wrapper">
              <div class="photo-frame-secondary" appCard3dTilt [maxTilt]="2" [scale]="1.02">
                <img 
                  src="assets/images/couple-2.jpg" 
                  alt="Palash and his bride sharing a joyful laugh under marigold garlands" 
                  class="story-photo-img"
                  loading="lazy"
                />
                <div class="polaroid-caption">
                  <span class="polaroid-tag-text">{{ t().story.captions.twoHearts }}</span>
                  <span class="polaroid-date">2026</span>
                </div>
              </div>
              <!-- Floating Stamp Pin -->
              <div class="gold-stamp" aria-hidden="true">
                <span>✦ Forever ✦</span>
              </div>
            </div>

            <!-- Romantic Quote Banner -->
            <div class="romantic-quote-card luxury-card" appCard3dTilt [maxTilt]="1.5" [scale]="1.01">
              <span class="quote-mark" aria-hidden="true">“</span>
              <p class="quote-text">{{ t().story.captions.foreverBegins }}</p>
              <p class="story-paragraph second-desc">
                {{ t().story.description2 }}
              </p>
              <div class="quote-signature">
                {{ groomName() }} & {{ brideName() }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .story-section {
      background: radial-gradient(ellipse at center top, #FFFDF9 0%, #FAF4EB 50%, #F5ECDD 100%);
      position: relative;
      overflow: hidden;
    }

    .story-bg-glow {
      position: absolute;
      top: 20%;
      right: -100px;
      width: 500px;
      height: 500px;
      background: radial-gradient(circle, rgba(235, 140, 155, 0.12) 0%, rgba(245, 166, 35, 0.08) 50%, transparent 70%);
      pointer-events: none;
      filter: blur(50px);
    }

    .magazine-grid {
      display: grid;
      grid-template-columns: 1.1fr 0.9fr;
      gap: 3.5rem;
      align-items: center;
      max-width: 1140px;
      margin: 0 auto;
    }

    /* Primary Frame (Left) */
    .photo-frame-primary {
      position: relative;
      border-radius: 28px;
      overflow: hidden;
      box-shadow: 0 24px 55px -12px rgba(90, 50, 20, 0.2), 0 4px 16px rgba(197, 160, 89, 0.25);
      border: 3px solid rgba(197, 160, 89, 0.45);
      margin-bottom: 2rem;
      transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease;
      cursor: pointer;
      -webkit-tap-highlight-color: transparent;
    }

    .photo-frame-primary:hover {
      transform: translateY(-4px);
    }

    .photo-frame-primary:active {
      transform: scale(0.985) translateY(0px) !important;
      box-shadow: 0 14px 35px -8px rgba(90, 50, 20, 0.25), 0 2px 10px rgba(197, 160, 89, 0.35) !important;
      transition: transform 0.15s ease, box-shadow 0.15s ease;
    }

    .story-photo-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
      transition: transform 0.8s ease;
    }

    .photo-frame-primary:hover .story-photo-img {
      transform: scale(1.03);
    }

    .photo-badge-caption {
      position: absolute;
      bottom: 1.25rem;
      left: 1.25rem;
      background: rgba(26, 18, 14, 0.75);
      backdrop-filter: blur(8px);
      padding: 6px 18px;
      border-radius: 9999px;
      border: 1px solid rgba(197, 160, 89, 0.6);
    }

    .caption-tag {
      color: #FFF9F0;
      font-size: 0.9rem;
      font-weight: 500;
      letter-spacing: 0.06em;
    }

    .story-narrative-card {
      padding: 2.2rem;
      background: rgba(255, 255, 255, 0.92);
      border: 1px solid rgba(197, 160, 89, 0.35);
      border-radius: 24px;
    }

    .story-paragraph {
      font-size: 1.05rem;
      line-height: 1.8;
      color: #4A3E38;
      margin-bottom: 0;
    }

    /* Secondary Frame (Right) */
    .polaroid-wrapper {
      position: relative;
      margin-bottom: 2.5rem;
      display: flex;
      justify-content: center;
    }

    .photo-frame-secondary {
      background: #FFFFFF;
      padding: 14px 14px 22px 14px;
      border-radius: 18px;
      box-shadow: 0 18px 45px -8px rgba(122, 25, 43, 0.15), 0 4px 14px rgba(0, 0, 0, 0.06);
      border: 1px solid rgba(197, 160, 89, 0.35);
      transform: rotate(2deg);
      transition: transform 0.4s ease, box-shadow 0.4s ease;
      max-width: 420px;
      width: 100%;
      cursor: pointer;
      -webkit-tap-highlight-color: transparent;
    }

    .photo-frame-secondary:hover {
      transform: rotate(0deg) translateY(-4px);
    }

    .photo-frame-secondary:active {
      transform: scale(0.98) rotate(1deg) !important;
      box-shadow: 0 10px 25px -4px rgba(122, 25, 43, 0.2) !important;
      transition: transform 0.15s ease, box-shadow 0.15s ease;
    }


    .photo-frame-secondary .story-photo-img {
      border-radius: 12px;
      max-height: 380px;
    }

    .polaroid-caption {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 12px;
      padding: 0 6px;
    }

    .polaroid-tag-text {
      font-family: var(--font-heading);
      font-size: 1.25rem;
      font-weight: 600;
      color: #7A192B;
    }

    .polaroid-date {
      font-size: 0.85rem;
      color: #C5A059;
      font-weight: 600;
      letter-spacing: 0.08em;
    }

    .gold-stamp {
      position: absolute;
      top: -15px;
      right: 15px;
      background: linear-gradient(135deg, #F3D99F 0%, #C5A059 100%);
      color: #1A130C;
      padding: 6px 14px;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      box-shadow: 0 4px 12px rgba(197, 160, 89, 0.4);
      transform: rotate(8deg);
    }

    /* Romantic Quote Card */
    .romantic-quote-card {
      padding: 2.2rem;
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(250, 246, 238, 0.9) 100%);
      border: 1px solid rgba(197, 160, 89, 0.4);
      border-radius: 24px;
      position: relative;
    }

    .quote-mark {
      font-family: var(--font-heading);
      font-size: 4.5rem;
      color: #C5A059;
      line-height: 0.7;
      display: block;
      opacity: 0.45;
      margin-bottom: 0.5rem;
    }

    .quote-text {
      font-family: var(--font-heading);
      font-size: 1.5rem;
      font-weight: 600;
      color: #7A192B;
      font-style: italic;
      margin-bottom: 0.8rem;
    }

    .second-desc {
      font-size: 0.95rem;
      color: #5C4E47;
      margin-bottom: 1.25rem;
    }

    .quote-signature {
      font-family: 'Alex Brush', cursive;
      font-size: 1.8rem;
      color: #C5A059;
      text-align: right;
    }

    @media (max-width: 1024px) {
      .magazine-grid {
        grid-template-columns: 1fr;
        gap: 2.5rem;
      }

      .polaroid-wrapper {
        margin-top: 1rem;
      }
    }

    @media (max-width: 640px) {
      .photo-frame-primary {
        border-radius: 20px;
        margin-bottom: 1.5rem;
      }

      .story-narrative-card {
        padding: 1.5rem 1.25rem;
        border-radius: 18px;
      }

      .story-paragraph {
        font-size: 0.96rem;
        line-height: 1.7;
      }

      .photo-frame-secondary {
        max-width: 100%;
        padding: 10px 10px 16px 10px;
      }

      .romantic-quote-card {
        padding: 1.75rem 1.25rem 1.5rem 1.25rem;
        border-radius: 18px;
      }

      .quote-text {
        font-size: 1.25rem;
      }
    }
  `]
})
export class CoupleStoryComponent {
  private translationService = inject(TranslationService);

  public readonly t = this.translationService.t;
  public readonly groomName = this.translationService.groomName;
  public readonly brideName = this.translationService.brideName;
}
