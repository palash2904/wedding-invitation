import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { TranslationService } from '../../services/translation.service';
import { WeddingDay, WeddingEvent } from '../../models/wedding-event.model';
import { Card3dTiltDirective } from '../../directives/card-3d-tilt.directive';
import { ScrollRevealDirective } from '../../directives/scroll-reveal.directive';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [CommonModule, Card3dTiltDirective, ScrollRevealDirective],
  template: `
    <section class="section-wrapper events-section" id="events" aria-label="Wedding Celebrations Timeline">
      <div class="content-container">
        <!-- Section Header -->
        <div class="section-header" appScrollReveal>
          <span class="section-tag">
            <span class="diya-spark" aria-hidden="true">🪔</span>
            {{ eventsSubheading() }}
          </span>
          <h2 class="section-title">{{ t().events.heading }}</h2>
          <div class="gold-divider" aria-hidden="true">
            <span class="divider-motif">❖ ⚜ ❖</span>
          </div>
        </div>

        <!-- Days Container -->
        <div class="days-container">
          <div *ngFor="let day of days(); let dayIdx = index" class="day-group">
            <!-- Day Banner Header -->
            <div class="day-banner luxury-card" appScrollReveal>
              <div class="day-badge-num">{{ dayIdx + 1 }}</div>
              <div class="day-banner-content">
                <h3 class="day-title">
                  {{ isHindi() ? day.dateFormattedHi : day.dateFormattedEn }}
                </h3>
                <span class="day-subtitle">
                  {{ isHindi() ? day.dayNameHi : day.dayNameEn }}
                </span>
              </div>
              <div class="day-diya-accent" aria-hidden="true">🪔</div>
            </div>

            <!-- Events Timeline Grid / Flow -->
            <div class="timeline-track">
              <div class="timeline-line" aria-hidden="true"></div>

              <div *ngFor="let event of day.events; let eventIdx = index" 
                   class="event-card-wrapper"
                   [class.even]="eventIdx % 2 === 0"
                   [class.odd]="eventIdx % 2 !== 0"
                   appScrollReveal
              >
                <!-- Central Timeline Node / Icon -->
                <div class="timeline-node" aria-hidden="true">
                  <div class="node-icon-circle">
                    <ng-container [ngSwitch]="event.iconType">
                      <!-- Diya Icon -->
                      <svg *ngSwitchCase="'diya'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" class="event-svg-icon">
                        <path d="M12 2C12 2 9 6 9 9C9 10.66 10.34 12 12 12C13.66 12 15 10.66 15 9C15 6 12 2 12 2Z" fill="#C5A059" stroke="#9A7836"/>
                        <path d="M3 13C3 17.5 7.03 21 12 21C16.97 21 21 17.5 21 13H3Z" stroke="#7A192B" fill="rgba(122,25,43,0.08)"/>
                        <path d="M2 13H22" stroke="#7A192B"/>
                      </svg>

                      <!-- Gift Icon -->
                      <svg *ngSwitchCase="'gift'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" class="event-svg-icon">
                        <polyline points="20 12 20 22 4 22 4 12"></polyline>
                        <rect x="2" y="7" width="20" height="5"></rect>
                        <line x1="12" y1="22" x2="12" y2="7"></line>
                        <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path>
                        <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path>
                      </svg>

                      <!-- Music / Sangeet Icon -->
                      <svg *ngSwitchCase="'music'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" class="event-svg-icon">
                        <path d="M9 18V5l12-2v13"></path>
                        <circle cx="6" cy="18" r="3"></circle>
                        <circle cx="18" cy="16" r="3"></circle>
                      </svg>

                      <!-- Engagement Rings Icon -->
                      <svg *ngSwitchCase="'ring'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" class="event-svg-icon">
                        <circle cx="9" cy="14" r="6" stroke="#C5A059"></circle>
                        <circle cx="15" cy="14" r="6" stroke="#7A192B"></circle>
                        <path d="M9 4L11 8H7L9 4Z" fill="#C5A059"></path>
                      </svg>

                      <!-- Haldi / Flower Icon -->
                      <svg *ngSwitchCase="'haldi'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" class="event-svg-icon">
                        <circle cx="12" cy="12" r="3" fill="#F5A623"></circle>
                        <path d="M12 2C13 5 15 7 18 7C15 9 13 11 12 14C11 11 9 9 6 7C9 7 11 5 12 2Z" fill="#F8CB46" opacity="0.8"></path>
                        <path d="M12 22C11 19 9 17 6 17C9 15 11 13 12 10C13 13 15 15 18 17C15 17 13 19 12 22Z" fill="#F8CB46" opacity="0.8"></path>
                      </svg>

                      <!-- Horse / Baraat Procession Icon -->
                      <svg *ngSwitchCase="'horse'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" class="event-svg-icon">
                        <path d="M4 21C4 18 6 15 9 14L10 9L6 7L7 3L13 4L16 8L20 9L21 13L17 13L15 21"></path>
                        <circle cx="10" cy="5" r="1" fill="currentColor"></circle>
                      </svg>

                      <!-- Dining / Feast Icon -->
                      <svg *ngSwitchCase="'dining'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" class="event-svg-icon">
                        <path d="M18 2v20"></path>
                        <path d="M22 2v6a4 4 0 0 1-4 4"></path>
                        <path d="M2 2v6a3 3 0 0 0 3 3v11"></path>
                        <path d="M7 2v6"></path>
                        <path d="M5 2v6"></path>
                      </svg>
                    </ng-container>
                  </div>
                </div>

                <!-- Event Details Card with Subtle 3D Tilt -->
                <div class="event-card luxury-card" [class.groom-event]="event.sideTag === 'groom'" [class.bride-event]="event.sideTag === 'bride'" appCard3dTilt [maxTilt]="2" [scale]="1.012">
                  <div class="event-card-header">
                    <span class="event-time-pill">
                      <svg class="time-clock-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                      </svg>
                      {{ isHindi() ? (event.timeHi || event.time) : event.time }}
                    </span>

                    <span *ngIf="event.sideTag && (event.sideTagEn || event.sideTagHi)" class="event-side-badge" [class.groom]="event.sideTag === 'groom'" [class.bride]="event.sideTag === 'bride'">
                      <span class="side-badge-icon" aria-hidden="true">{{ event.sideTag === 'groom' ? '👑' : '🌸' }}</span>
                      {{ isHindi() ? (event.sideTagHi || (event.sideTag === 'groom' ? 'वर पक्ष' : 'वधू पक्ष')) : (event.sideTagEn || (event.sideTag === 'groom' ? "Groom's Side" : "Bride's Side")) }}
                    </span>
                  </div>

                  <h4 class="event-title">
                    {{ isHindi() ? event.titleHi : event.title }}
                  </h4>

                  <p class="event-description">
                    {{ isHindi() ? event.descriptionHi : event.description }}
                  </p>

                  <!-- Event-specific venue location pill (e.g. Mata Poojan at Residence) -->
                  <div *ngIf="event.venueAddress" class="event-specific-venue">
                      <span class="event-venue-icon" aria-hidden="true">📍</span>
                      <span class="event-venue-text">
                       <strong>{{ isHindi() ? (event.venueNameHi || event.venueName) : (event.venueName || event.venueNameHi) }}:</strong>
                       {{ isHindi() ? (event.venueAddressHi || event.venueAddress) : (event.venueAddress || event.venueAddressHi) }}
                      </span>

                     <iframe
                       *ngIf="event.venueMapEmbedUrl"
                       [src]="getEventMapEmbedUrl(event)"
                       width="100%"
                       height="180"
                       style="border:0; border-radius: 10px; margin-top: 8px;"
                       allowfullscreen="false"
                       loading="lazy"
                       referrerpolicy="no-referrer-when-downgrade"
                       title="Event location map"
                     ></iframe>

                      <a *ngIf="event.venueMapUrl" [href]="event.venueMapUrl" target="_blank" rel="noopener noreferrer" class="event-map-link" title="Get directions" style="margin-top: 6px; display: inline-block;">
                          {{ isHindi() ? 'दिशा-निर्देश प्राप्त करें' : 'GET DIRECTIONS' }} ↗
                      </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Venue & Location Showcase Card with 3D Depth & Embedded Map -->
        <div class="venue-location-card luxury-card" appScrollReveal appCard3dTilt [maxTilt]="1.2" [scale]="1.01">
          <div class="venue-card-inner">
            <!-- Venue Header (Screenshot style) -->
            <div class="venue-header-box">
              <span class="venue-tag-badge">
                🪔 {{ isHindi() ? 'विवाह स्थल' : 'Wedding Venue' }} 🪔
              </span>
              <h3 class="venue-name-heading">
                {{ isHindi() ? couple().venueNameHi : couple().venueName }}
              </h3>
              <p class="venue-address-text">
                <span class="venue-pin-accent" aria-hidden="true">📍</span>
                {{ isHindi() ? couple().venueAddressHi : couple().venueAddress }}
              </p>
            </div>

            <!-- Embedded Interactive Google Map -->
            <div class="venue-map-wrapper">
              <iframe 
                [src]="venueMapEmbedUrl()" 
                width="100%" 
                height="280" 
                style="border:0;" 
                allowfullscreen="" 
                loading="lazy" 
                referrerpolicy="no-referrer-when-downgrade"
                title="Wedding Venue Google Map"
                class="venue-map-frame"
              ></iframe>

              <a 
                [href]="couple().venueMapUrl" 
                target="_blank" 
                rel="noopener noreferrer" 
                class="map-overlay-link-btn"
                title="Open in Google Maps"
              >
                <span>Open in Maps</span>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                  <polyline points="15 3 21 3 21 9"></polyline>
                  <line x1="10" y1="14" x2="21" y2="3"></line>
                </svg>
              </a>
            </div>

            <!-- Get Directions Primary Action Button -->
            <div class="venue-action-box">
              <a 
                [href]="couple().venueMapUrl" 
                target="_blank" 
                rel="noopener noreferrer" 
                class="venue-get-directions-btn"
                id="maps-direction-btn"
              >
                <span>{{ isHindi() ? 'दिशा-निर्देश प्राप्त करें (GET DIRECTIONS)' : 'GET DIRECTIONS' }}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .events-section {
      background: linear-gradient(180deg, #F5ECDD 0%, #FAF6EE 50%, #F8EFE3 100%);
      position: relative;
    }

    .days-container {
      display: flex;
      flex-direction: column;
      gap: 4.5rem;
      max-width: 1040px;
      margin: 0 auto;
    }

    /* Day Banner */
    .day-banner {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      padding: 1.5rem 2.5rem;
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.96) 0%, rgba(247, 241, 230, 0.95) 100%);
      border: 2px solid rgba(197, 160, 89, 0.5);
      border-radius: 24px;
      box-shadow: 0 10px 30px -6px rgba(122, 25, 43, 0.1);
      position: relative;
    }

    .day-badge-num {
      width: 46px;
      height: 46px;
      border-radius: 50%;
      background: linear-gradient(135deg, #7A192B 0%, #560F1D 100%);
      color: #FFF9F0;
      font-family: var(--font-heading);
      font-size: 1.5rem;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(122, 25, 43, 0.35);
      flex-shrink: 0;
    }

    .day-banner-content {
      flex: 1;
    }

    .day-title {
      font-size: clamp(1.4rem, 2.8vw, 1.8rem);
      color: #7A192B;
      font-weight: 700;
      margin-bottom: 0.15rem;
    }

    .day-subtitle {
      font-size: 0.95rem;
      color: #C5A059;
      font-weight: 600;
      letter-spacing: 0.04em;
    }

    .day-diya-accent {
      font-size: 1.6rem;
      filter: drop-shadow(0 0 6px rgba(245, 166, 35, 0.5));
    }

    /* Timeline Track */
    .timeline-track {
      position: relative;
      padding: 2.5rem 0;
    }

    .timeline-line {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 50%;
      width: 2px;
      transform: translateX(-50%);
      background: linear-gradient(180deg, rgba(197, 160, 89, 0.1) 0%, rgba(197, 160, 89, 0.8) 15%, rgba(197, 160, 89, 0.8) 85%, rgba(197, 160, 89, 0.1) 100%);
    }

    .event-card-wrapper {
      position: relative;
      margin-bottom: 2.5rem;
      width: 50%;
      display: flex;
    }

    .event-card-wrapper:last-child {
      margin-bottom: 0;
    }

    .event-card-wrapper.even {
      left: 0;
      padding-right: 3rem;
      justify-content: flex-end;
    }

    .event-card-wrapper.odd {
      left: 50%;
      padding-left: 3rem;
      justify-content: flex-start;
    }

    /* Central Node */
    .timeline-node {
      position: absolute;
      top: 1.75rem;
      z-index: 5;
    }

    .event-card-wrapper.even .timeline-node {
      right: -24px;
    }

    .event-card-wrapper.odd .timeline-node {
      left: -24px;
    }

    .node-icon-circle {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: #FFFFFF;
      border: 2px solid #C5A059;
      box-shadow: 0 4px 16px rgba(197, 160, 89, 0.35);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #7A192B;
      transition: all 0.3s ease;
    }

    .event-card-wrapper:hover .node-icon-circle {
      transform: scale(1.15);
      background: linear-gradient(135deg, #FFF8EB 0%, #FFFFFF 100%);
      border-color: #7A192B;
    }

    .event-svg-icon {
      width: 22px;
      height: 22px;
    }

    /* Event Card */
    .event-card {
      width: 100%;
      max-width: 420px;
      padding: 1.75rem 2rem;
      background: rgba(255, 255, 255, 0.94);
      border: 1px solid rgba(197, 160, 89, 0.35);
      border-radius: 20px;
      transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
      cursor: pointer;
      -webkit-tap-highlight-color: transparent;
    }

    .event-card:hover {
      transform: translateY(-3px);
      box-shadow: 0 16px 36px -8px rgba(122, 25, 43, 0.12), 0 4px 14px rgba(197, 160, 89, 0.2);
      border-color: #C5A059;
    }

    .event-card:active {
      transform: scale(0.985) translateY(0px) !important;
      box-shadow: 0 8px 20px -4px rgba(122, 25, 43, 0.18), 0 2px 10px rgba(197, 160, 89, 0.3) !important;
      border-color: rgba(197, 160, 89, 0.85);
      transition: transform 0.15s ease, box-shadow 0.15s ease;
    }


    .event-card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      flex-wrap: wrap;
      margin-bottom: 0.85rem;
    }

    .event-side-badge {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      padding: 4px 10px;
      border-radius: 9999px;
      font-size: 0.78rem;
      font-weight: 700;
      letter-spacing: 0.02em;
    }

    .event-side-badge.groom {
      background: linear-gradient(135deg, rgba(122, 25, 43, 0.12) 0%, rgba(122, 25, 43, 0.06) 100%);
      color: #7A192B;
      border: 1px solid rgba(122, 25, 43, 0.25);
    }

    .event-side-badge.bride {
      background: linear-gradient(135deg, rgba(197, 160, 89, 0.22) 0%, rgba(243, 217, 159, 0.25) 100%);
      color: #8A5E12;
      border: 1px solid rgba(197, 160, 89, 0.45);
    }

    .side-badge-icon {
      font-size: 0.85rem;
    }

    .event-time-pill {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 5px 14px;
      background: linear-gradient(135deg, rgba(243, 217, 159, 0.3) 0%, rgba(197, 160, 89, 0.2) 100%);
      border: 1px solid rgba(197, 160, 89, 0.4);
      border-radius: 9999px;
      font-size: 0.85rem;
      font-weight: 700;
      color: #7A192B;
    }

    .time-clock-svg {
      width: 14px;
      height: 14px;
      color: #C5A059;
    }

    .event-title {
      font-size: 1.45rem;
      font-weight: 600;
      color: #2E2520;
      margin-bottom: 0.5rem;
    }

    .event-description {
      font-size: 0.92rem;
      color: #6E6259;
      line-height: 1.6;
      margin-bottom: 0;
    }

    .event-specific-venue {
      margin-top: 0.85rem;
      padding: 6px 12px;
      background: rgba(243, 217, 159, 0.28);
      border: 1px solid rgba(197, 160, 89, 0.5);
      border-radius: 8px;
      font-size: 0.82rem;
      color: #4A3E39;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      flex-wrap: wrap;
    }

    .event-specific-venue strong {
      color: #7A192B;
    }

    .event-map-link {
      font-weight: 700;
      color: #7A192B;
      text-decoration: underline;
      margin-left: 2px;
      font-size: 0.78rem;
    }

    /* Mobile Timeline Layout */
    @media (max-width: 768px) {
      .days-container {
        gap: 3rem;
      }

      .day-banner {
        padding: 1.1rem 1.25rem;
        gap: 0.85rem;
        border-radius: 18px;
      }

      .day-badge-num {
        width: 36px;
        height: 36px;
        font-size: 1.15rem;
      }

      .day-title {
        font-size: 1.25rem;
      }

      .day-subtitle {
        font-size: 0.85rem;
      }

      .timeline-track {
        padding: 1.25rem 0;
      }

      .timeline-line {
        left: 18px;
        transform: none;
      }

      .event-card-wrapper,
      .event-card-wrapper.even,
      .event-card-wrapper.odd {
        left: 0;
        width: 100%;
        padding-left: 3.2rem;
        padding-right: 0;
        justify-content: flex-start;
        margin-bottom: 1.75rem;
      }

      .event-card-wrapper.even .timeline-node,
      .event-card-wrapper.odd .timeline-node {
        left: 0;
        right: auto;
        top: 1.25rem;
      }

      .node-icon-circle {
        width: 36px;
        height: 36px;
      }

      .event-svg-icon {
        width: 17px;
        height: 17px;
      }

      .event-card {
        max-width: 100%;
        padding: 1.25rem 1rem;
        border-radius: 16px;
      }

      .event-title {
        font-size: 1.2rem;
      }

      .event-description {
        font-size: 0.88rem;
      }
    }

    /* Venue Showcase Card matching the elegant map card design */
    .venue-location-card {
      margin-top: 4rem;
      max-width: 680px;
      margin-left: auto;
      margin-right: auto;
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(252, 248, 241, 0.96) 100%);
      border: 1.5px solid rgba(197, 160, 89, 0.45);
      border-radius: 24px;
      padding: 2.25rem 2rem;
      box-shadow: 0 16px 40px -8px rgba(122, 25, 43, 0.09), 0 4px 16px rgba(197, 160, 89, 0.12);
    }

    .venue-card-inner {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;
    }

    .venue-header-box {
      text-align: center;
      margin-bottom: 1.5rem;
      width: 100%;
    }

    .venue-tag-badge {
      display: inline-block;
      font-size: 0.8rem;
      font-weight: 700;
      color: #7A192B;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      margin-bottom: 0.4rem;
    }

    .venue-name-heading {
      font-family: var(--font-heading, 'Playfair Display', serif);
      font-size: clamp(1.4rem, 2.6vw, 1.75rem);
      color: #382E2B;
      font-weight: 700;
      margin-bottom: 0.35rem;
    }

    .venue-address-text {
      font-size: 0.95rem;
      color: #63534B;
      line-height: 1.45;
      margin: 0 auto;
      max-width: 480px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.35rem;
    }

    .venue-pin-accent {
      font-size: 1rem;
      flex-shrink: 0;
    }

    /* Embedded Map Wrapper */
    .venue-map-wrapper {
      position: relative;
      width: 100%;
      height: 280px;
      border-radius: 18px;
      overflow: hidden;
      border: 1.5px solid rgba(197, 160, 89, 0.4);
      box-shadow: 0 8px 24px -4px rgba(122, 25, 43, 0.08);
      background: #f0ede6;
    }

    .venue-map-frame {
      display: block;
      width: 100%;
      height: 100%;
      border: 0;
    }

    .map-overlay-link-btn {
      position: absolute;
      top: 12px;
      left: 12px;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(6px);
      padding: 6px 12px;
      border-radius: 6px;
      border: 1px solid rgba(0, 0, 0, 0.12);
      font-size: 0.82rem;
      font-weight: 600;
      color: #1a73e8;
      text-decoration: none;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: all 0.2s ease;
      z-index: 5;
    }

    .map-overlay-link-btn:hover {
      background: #ffffff;
      color: #1557b0;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.18);
      transform: translateY(-1px);
    }

    /* Primary Get Directions Button */
    .venue-action-box {
      margin-top: 1.75rem;
      width: 100%;
      display: flex;
      justify-content: center;
    }

    .venue-get-directions-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #C29352 0%, #A87836 100%);
      color: #ffffff;
      padding: 13px 36px;
      min-width: 220px;
      border-radius: 8px;
      font-weight: 700;
      font-size: 0.92rem;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      text-decoration: none;
      box-shadow: 0 6px 18px rgba(168, 120, 54, 0.35);
      transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
      cursor: pointer;
      text-align: center;
      border: 1px solid rgba(255, 255, 255, 0.25);
    }

    .venue-get-directions-btn:hover {
      background: linear-gradient(135deg, #D4A25E 0%, #B88540 100%);
      box-shadow: 0 10px 24px rgba(168, 120, 54, 0.45);
      transform: translateY(-2px);
      color: #ffffff;
    }

    .venue-get-directions-btn:active {
      transform: translateY(0);
      box-shadow: 0 4px 12px rgba(168, 120, 54, 0.3);
    }

    @media (max-width: 768px) {
      .venue-location-card {
        padding: 1.75rem 1.25rem;
        margin-top: 2.5rem;
      }

      .venue-map-wrapper {
        height: 240px;
      }

      .venue-get-directions-btn {
        width: 100%;
        max-width: 320px;
        padding: 12px 20px;
        font-size: 0.85rem;
      }
    }

    @media (max-width: 420px) {
      .event-card-wrapper,
      .event-card-wrapper.even,
      .event-card-wrapper.odd {
        padding-left: 2.8rem;
      }

      .event-card {
        padding: 1rem 0.85rem;
      }

      .event-title {
        font-size: 1.1rem;
      }
    }
  `]
})
export class EventsComponent {
  private translationService = inject(TranslationService);
  private sanitizer = inject(DomSanitizer);

  public readonly t = this.translationService.t;
  public readonly isHindi = this.translationService.isHindi;
  public readonly couple = this.translationService.couple;
  public readonly days = this.translationService.days;
  public readonly eventsSubheading = this.translationService.eventsSubheading;

  public readonly venueMapEmbedUrl = computed<SafeResourceUrl>(() => {
    const venue = this.couple();
    if (venue.venueMapEmbedUrl) {
      return this.sanitizer.bypassSecurityTrustResourceUrl(venue.venueMapEmbedUrl);
    }
    const target = venue.venueCoordinates || encodeURIComponent(`${venue.venueName}, ${venue.venueAddress}`);
    const url = `https://maps.google.com/maps?q=${target}&hl=en&z=17&output=embed`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  });
  public getEventMapEmbedUrl(event: { venueMapEmbedUrl?: string; venueAddress?: string; venueName?: string }): SafeResourceUrl {
  const url = event.venueMapEmbedUrl
    || `https://maps.google.com/maps?q=${encodeURIComponent(`${event.venueName}, ${event.venueAddress}`)}&hl=en&z=16&output=embed`;
  return this.sanitizer.bypassSecurityTrustResourceUrl(url);
}
}
