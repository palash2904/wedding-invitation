import { Component, inject, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationService } from '../../services/translation.service';
import { AudioService } from '../../services/audio.service';

@Component({
  selector: 'app-top-controls',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="top-nav-bar" role="banner">
      <div class="controls-container">
        <!-- Left: Language Switcher EN | हिंदी -->
        <div class="lang-switch-wrapper" role="group" aria-label="Language selection">
          <button 
            type="button"
            class="lang-btn"
            [class.active]="translationService.currentLang() === 'en'"
            (click)="translationService.setLanguage('en')"
            aria-label="Switch to English"
            id="lang-btn-en"
          >
            EN
          </button>
          <span class="lang-divider" aria-hidden="true">|</span>
          <button 
            type="button"
            class="lang-btn hindi-text"
            [class.active]="translationService.currentLang() === 'hi'"
            (click)="translationService.setLanguage('hi')"
            id="lang-btn-hi"
          >
            हिंदी
          </button>
        </div>

        <!-- Right: Action Buttons (Replay Envelope & Music Toggle) -->
        <div class="right-controls-group">
          <!-- Replay Envelope Intro Button -->
          <button 
            type="button" 
            class="replay-btn" 
            (click)="onReplayClick()"
            [attr.aria-label]="translationService.isHindi() ? 'निमंत्रण पत्र पुनः खोलें' : 'Replay wedding invitation envelope'"
            id="intro-replay-btn"
          >
            <span class="replay-envelope-icon" aria-hidden="true">💌</span>
            <span class="replay-label-full">{{ translationService.isHindi() ? 'पुनः खोलें' : 'Back' }}</span>
          </button>

          <!-- Music Toggle -->
          
        </div>
      </div>
    </header>
  `,
  styles: [`
    :host {
      display: block;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      width: 100%;
      max-width: 100vw;
      z-index: 99999;
      pointer-events: none;
      box-sizing: border-box;
      overflow: hidden;
    }

    .top-nav-bar {
      position: fixed;
      top: max(0.85rem, env(safe-area-inset-top, 0.85rem));
      left: 0;
      right: 0;
      width: 100%;
      max-width: 100vw;
      box-sizing: border-box;
      z-index: 99999;
      pointer-events: none;
      padding: 0 max(1.25rem, env(safe-area-inset-right, 1.25rem)) 0 max(1.25rem, env(safe-area-inset-left, 1.25rem));
      transition: all 0.3s ease;
    }

    .controls-container {
      max-width: 1240px;
      width: 100%;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      box-sizing: border-box;
    }

    .right-controls-group {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-shrink: 0;
    }

    .lang-switch-wrapper,
    .replay-btn,
    .music-btn {
      pointer-events: auto;
      background: rgba(253, 251, 247, 0.94);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1.5px solid rgba(197, 160, 89, 0.55);
      border-radius: 9999px;
      box-shadow: 0 8px 30px -4px rgba(44, 36, 32, 0.18), 0 2px 8px rgba(197, 160, 89, 0.25);
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      user-select: none;
      -webkit-tap-highlight-color: transparent;
      box-sizing: border-box;
    }

    .replay-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 8px 14px;
      min-height: 44px;
      color: #7A192B;
      font-size: 0.88rem;
      font-weight: 600;
      cursor: pointer;

      .replay-envelope-icon {
        font-size: 1rem;
        line-height: 1;
      }

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 12px 28px -4px rgba(197, 160, 89, 0.4);
        border-color: rgba(197, 160, 89, 0.85);
      }

      &:active {
        transform: scale(0.94) translateY(1px);
        box-shadow: 0 4px 14px rgba(197, 160, 89, 0.3);
      }
    }

    .music-label-full {
      display: inline;
    }

    .music-label-short {
      display: none;
    }

    .lang-switch-wrapper {
      display: inline-flex;
      align-items: center;
      padding: 4px 6px;
      min-height: 44px;
    }

    .lang-btn {
      padding: 6px 14px;
      font-size: 0.88rem;
      font-weight: 500;
      color: #6E6259;
      border-radius: 9999px;
      transition: all 0.25s ease;
      min-height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .lang-btn:active {
      transform: scale(0.92);
    }

    .lang-btn.hindi-text {
      font-family: 'Noto Serif Devanagari', serif;
      font-weight: 600;
    }

    .lang-btn.active {
      background: linear-gradient(135deg, #F3D99F 0%, #C5A059 100%);
      color: #1A130C;
      font-weight: 700;
      box-shadow: 0 2px 8px rgba(197, 160, 89, 0.4);
    }

    .lang-divider {
      color: rgba(197, 160, 89, 0.5);
      margin: 0 2px;
      font-size: 0.85rem;
    }

    .music-btn {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      padding: 8px 18px;
      min-height: 44px;
      color: #2E2520;
      font-size: 0.9rem;
      font-weight: 600;
      font-family: inherit;
    }

    .music-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 12px 28px -4px rgba(197, 160, 89, 0.4);
      border-color: rgba(197, 160, 89, 0.85);
    }

    .music-btn:active {
      transform: scale(0.94) translateY(1px);
      box-shadow: 0 4px 14px rgba(197, 160, 89, 0.3);
      transition: transform 0.15s ease, box-shadow 0.15s ease;
    }

    .music-btn.playing {
      background: rgba(255, 255, 255, 0.97);
      border-color: #C5A059;
      box-shadow: 0 8px 24px -4px rgba(197, 160, 89, 0.35), 0 0 14px rgba(243, 217, 159, 0.5);
    }

    .music-icon-wrapper {
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #C5A059;
      transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .music-btn:hover .music-icon-wrapper {
      transform: scale(1.1);
    }

    .music-icon-wrapper svg {
      width: 100%;
      height: 100%;
    }

    .equalizer-bars {
      display: inline-flex;
      align-items: flex-end;
      gap: 3px;
      height: 14px;
      margin-left: 2px;
    }

    .equalizer-bars .bar {
      width: 3px;
      background: #C5A059;
      border-radius: 2px;
      animation: equalize 1s ease-in-out infinite alternate;
    }

    .equalizer-bars .bar-1 { height: 60%; animation-delay: 0.1s; }
    .equalizer-bars .bar-2 { height: 100%; animation-delay: 0.3s; }
    .equalizer-bars .bar-3 { height: 40%; animation-delay: 0.2s; }

    @keyframes equalize {
      0% { height: 25%; }
      100% { height: 100%; }
    }

    /* Mobile Responsive - Floating Buttons */
    @media (max-width: 640px) {
      .top-nav-bar {
        top: max(0.5rem, env(safe-area-inset-top, 0.5rem));
        padding: 0 max(0.4rem, env(safe-area-inset-right, 0.4rem)) 0 max(0.4rem, env(safe-area-inset-left, 0.4rem));
      }

      .controls-container {
        justify-content: space-between;
        gap: 6px;
      }

      .lang-switch-wrapper {
        padding: 2px 4px;
        min-height: 36px;
        flex-shrink: 0;
      }

      .lang-btn {
        padding: 3px 7px;
        font-size: 0.76rem;
        min-height: 28px;
      }

      .right-controls-group {
        gap: 5px;
        flex-shrink: 0;
      }

      .replay-btn {
        padding: 5px 8px;
        min-height: 36px;
        font-size: 0.76rem;
      }

      .music-btn {
        padding: 5px 9px;
        min-height: 36px;
        gap: 4px;
      }

      .music-label-full {
        display: none !important;
      }

      .music-label-short {
        display: inline !important;
        font-size: 0.76rem;
        font-weight: 600;
        white-space: nowrap;
      }

      .music-icon-wrapper {
        width: 16px;
        height: 16px;
      }

      .equalizer-bars {
        gap: 2px;
        height: 11px;
      }

      .equalizer-bars .bar {
        width: 2px;
      }
    }

    @media (max-width: 360px) {
      .top-nav-bar {
        top: max(0.35rem, env(safe-area-inset-top, 0.35rem));
        padding: 0 0.25rem;
      }

      .controls-container {
        gap: 3px;
      }

      .right-controls-group {
        gap: 3px;
      }

      .lang-switch-wrapper {
        padding: 1px 2px;
        min-height: 32px;
      }

      .lang-btn {
        padding: 2px 5px;
        font-size: 0.7rem;
        min-height: 24px;
      }

      .replay-btn {
        padding: 4px 6px;
        min-height: 32px;
        font-size: 0.7rem;
      }

      .music-btn {
        padding: 4px 6px;
        min-height: 32px;
        gap: 3px;
      }

      .music-label-short {
        font-size: 0.7rem;
      }

      .equalizer-bars {
        display: none;
      }
    }
  `]
})
export class TopControlsComponent {
  public readonly translationService = inject(TranslationService);
  public readonly audioService = inject(AudioService);

  public readonly replayIntro = output<void>();
  public readonly t = this.translationService.t;

  public toggleMusic(): void {
    this.audioService.toggle();
  }

  public onReplayClick(): void {
    this.replayIntro.emit();
  }
}
