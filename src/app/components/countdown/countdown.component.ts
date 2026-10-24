import { Component, OnInit, OnDestroy, inject, signal, computed, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { TranslationService } from '../../services/translation.service';
import { Card3dTiltDirective } from '../../directives/card-3d-tilt.directive';
import { ScrollRevealDirective } from '../../directives/scroll-reveal.directive';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isComplete: boolean;
}

@Component({
  selector: 'app-countdown',
  standalone: true,
  imports: [CommonModule, Card3dTiltDirective, ScrollRevealDirective],
  template: `
    <section class="section-wrapper countdown-section" id="countdown" aria-label="Wedding Countdown">
      <div class="content-container">
        <div class="section-header" appScrollReveal>
          <span class="section-tag">
            <span class="diya-icon" aria-hidden="true">⏳</span>
            {{ t().countdown.subheading }}
          </span>
          <h2 class="section-title">{{ t().countdown.heading }}</h2>
          <div class="gold-divider" aria-hidden="true">
            <span class="divider-motif">✦ 🪔 ✦</span>
          </div>
        </div>

        <!-- Luxury Countdown Display with 3D Depth -->
        <div *ngIf="!timeLeft().isComplete; else celebrationActive" class="countdown-grid" role="timer" aria-live="polite" appScrollReveal>
          <!-- Days Box -->
          <div class="time-card luxury-card" appCard3dTilt [maxTilt]="2" [scale]="1.015">
            <div class="time-card-inner">
              <span class="time-value gold-text">{{ padZero(timeLeft().days) }}</span>
              <span class="time-label">{{ t().countdown.days }}</span>
            </div>
            <div class="card-glow" aria-hidden="true"></div>
          </div>

          <!-- Hours Box -->
          <div class="time-card luxury-card" appCard3dTilt [maxTilt]="2" [scale]="1.015">
            <div class="time-card-inner">
              <span class="time-value gold-text">{{ padZero(timeLeft().hours) }}</span>
              <span class="time-label">{{ t().countdown.hours }}</span>
            </div>
            <div class="card-glow" aria-hidden="true"></div>
          </div>

          <!-- Minutes Box -->
          <div class="time-card luxury-card" appCard3dTilt [maxTilt]="2" [scale]="1.015">
            <div class="time-card-inner">
              <span class="time-value gold-text">{{ padZero(timeLeft().minutes) }}</span>
              <span class="time-label">{{ t().countdown.minutes }}</span>
            </div>
            <div class="card-glow" aria-hidden="true"></div>
          </div>

          <!-- Seconds Box -->
          <div class="time-card luxury-card" appCard3dTilt [maxTilt]="2" [scale]="1.015">
            <div class="time-card-inner">
              <span class="time-value gold-text">{{ padZero(timeLeft().seconds) }}</span>
              <span class="time-label">{{ t().countdown.seconds }}</span>
            </div>
            <div class="card-glow" aria-hidden="true"></div>
          </div>
        </div>

        <!-- When Countdown Completes -->
        <ng-template #celebrationActive>
          <div class="celebration-started-box luxury-card" appScrollReveal>
            <span class="sparkle-icon" aria-hidden="true">✨</span>
            <h3 class="celebration-started-text">{{ t().countdown.celebrationStarted }}</h3>
            <span class="sparkle-icon" aria-hidden="true">✨</span>
          </div>
        </ng-template>
      </div>
    </section>
  `,
  styles: [`
    .countdown-section {
      background: radial-gradient(circle at center, #FFFBF5 0%, #F5ECDD 100%);
      position: relative;
    }

    .countdown-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1.5rem;
      max-width: 900px;
      margin: 0 auto;
    }

    .time-card {
      padding: 2.2rem 1.2rem;
      text-align: center;
      background: rgba(255, 255, 255, 0.95);
      border: 1px solid rgba(197, 160, 89, 0.4);
      border-radius: 20px;
      box-shadow: 0 14px 35px -8px rgba(122, 25, 43, 0.08), 0 4px 12px rgba(197, 160, 89, 0.15);
      position: relative;
      overflow: hidden;
      transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .time-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 20px 45px -8px rgba(197, 160, 89, 0.3);
      border-color: #C5A059;
    }

    .time-card-inner {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
      position: relative;
      z-index: 2;
    }

    .time-value {
      font-family: var(--font-heading);
      font-size: clamp(2.6rem, 5vw, 4rem);
      font-weight: 700;
      line-height: 1;
      letter-spacing: 0.02em;
    }

    .time-label {
      font-size: 0.88rem;
      font-weight: 600;
      color: #7A192B;
      text-transform: uppercase;
      letter-spacing: 0.12em;
    }

    .card-glow {
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: radial-gradient(circle, rgba(243, 217, 159, 0.2) 0%, transparent 60%);
      pointer-events: none;
    }

    .celebration-started-box {
      max-width: 600px;
      margin: 0 auto;
      padding: 3rem 2rem;
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 16px;
      background: rgba(255, 255, 255, 0.95);
      border: 2px solid #C5A059;
      border-radius: 24px;
    }

    .celebration-started-text {
      font-size: 1.8rem;
      color: #7A192B;
      font-weight: 600;
    }

    .sparkle-icon {
      font-size: 1.8rem;
    }

    @media (max-width: 768px) {
      .countdown-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 0.85rem;
        max-width: 380px;
      }

      .time-card {
        padding: 1.35rem 0.6rem;
        border-radius: 16px;
      }

      .time-value {
        font-size: 2.2rem;
      }

      .time-label {
        font-size: 0.78rem;
        letter-spacing: 0.08em;
      }
    }

    @media (max-width: 380px) {
      .countdown-grid {
        gap: 0.6rem;
        max-width: 320px;
      }

      .time-card {
        padding: 1.1rem 0.4rem;
        border-radius: 14px;
      }

      .time-value {
        font-size: 1.9rem;
      }

      .time-label {
        font-size: 0.72rem;
      }
    }
  `]
})
export class CountdownComponent implements OnInit, OnDestroy {
  private translationService = inject(TranslationService);
  private platformId = inject(PLATFORM_ID);

  public readonly t = this.translationService.t;
  public readonly couple = this.translationService.couple;

  private timerInterval: any = null;

  public readonly timeLeft = signal<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isComplete: false
  });

  ngOnInit(): void {
    this.calculateTimeLeft();

    if (isPlatformBrowser(this.platformId)) {
      this.timerInterval = setInterval(() => {
        this.calculateTimeLeft();
      }, 1000);
    }
  }

  private calculateTimeLeft(): void {
    const target = new Date(this.couple().targetCountdownDate).getTime();
    const now = new Date().getTime();
    const difference = target - now;

    if (difference <= 0) {
      this.timeLeft.set({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        isComplete: true
      });
      if (this.timerInterval) {
        clearInterval(this.timerInterval);
      }
      return;
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    this.timeLeft.set({
      days,
      hours,
      minutes,
      seconds,
      isComplete: false
    });
  }

  public padZero(num: number): string {
    return num < 10 ? `0${num}` : `${num}`;
  }

  ngOnDestroy(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }
}
