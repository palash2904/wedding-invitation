import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EnvelopeIntroComponent } from '../envelope-intro/envelope-intro.component';
import { TopControlsComponent } from '../top-controls/top-controls.component';
import { HeroComponent } from '../hero/hero.component';
import { WelcomeComponent } from '../welcome/welcome.component';
import { CountdownComponent } from '../countdown/countdown.component';
import { EventsComponent } from '../events/events.component';
import { HighlightComponent } from '../highlight/highlight.component';
import { ClosingComponent } from '../closing/closing.component';
import { FooterComponent } from '../footer/footer.component';
import { TranslationService } from '../../services/translation.service';
import { AudioService } from '../../services/audio.service';

@Component({
  selector: 'app-invitation',
  standalone: true,
  imports: [
    CommonModule,
    EnvelopeIntroComponent,
    TopControlsComponent,
    HeroComponent,
    WelcomeComponent,
    CountdownComponent,
    EventsComponent,
    HighlightComponent,
    ClosingComponent,
    FooterComponent
  ],
  template: `
    <!-- 0. Interactive "Open the Wedding Invitation" 3D Luxury Envelope Intro -->
    <app-envelope-intro
      *ngIf="isIntroVisible()"
      (introDismissed)="onIntroDismissed()"
    ></app-envelope-intro>

    <!-- Floating Top Controls: Language Switcher (EN | हिंदी) & Background Music Button -->
    <app-top-controls (replayIntro)="replayIntro()"></app-top-controls>

    <main class="wedding-page-main" id="main-content">
      <!-- 1. Opening / Hero with Ghibli couple artwork & floating petals -->
      <app-hero></app-hero>

      <!-- 2. Welcome & Invitation Message -->
      <app-welcome></app-welcome>

      <!-- 3. Wedding Celebrations & Rituals Timeline -->
      <app-events></app-events>

      <!-- 4. Real-time Luxury Countdown Timer -->
      <app-countdown></app-countdown>

      <!-- 5. Couple Story & Magazine Photo Showcase -->
      <!-- <app-couple-story></app-couple-story> -->

      <!-- 6. Romantic Highlight Section with Sunset Palace Atmosphere -->
      <app-highlight></app-highlight>

      <!-- 7. Final Invitation & Couple Signoff -->
      <app-closing></app-closing>
    </main>

    <!-- 7. Minimal Wedding Footer -->
    <app-footer></app-footer>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
      max-width: 100vw;
      overflow-x: hidden;
    }

    .wedding-page-main {
      position: relative;
      width: 100%;
      max-width: 100vw;
      overflow-x: hidden;
    }
  `]
})
export class InvitationComponent implements OnInit {
  public readonly translationService = inject(TranslationService);
  private readonly audioService = inject(AudioService);

  public readonly isIntroVisible = signal<boolean>(this.shouldShowIntro());

  private shouldShowIntro(): boolean {
    if (typeof window === 'undefined') return true;
    const params = new URLSearchParams(window.location.search);
    if (params.get('intro') === 'false' || params.get('no-intro') === '1' || params.get('skipIntro') === 'true') {
      return false;
    }
    return true;
  }

  ngOnInit(): void {
    if (!this.isIntroVisible()) {
      this.audioService.tryAutoplay();
    }
  }

  public onIntroDismissed(): void {
    this.isIntroVisible.set(false);
  }

  public replayIntro(): void {
    this.isIntroVisible.set(true);
  }
}
