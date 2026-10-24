import {
  Component,
  OnInit,
  OnDestroy,
  inject,
  signal,
  computed,
  input,
  output,
  PLATFORM_ID
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { TranslationService } from '../../services/translation.service';
import { AudioService } from '../../services/audio.service';

@Component({
  selector: 'app-envelope-intro',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './envelope-intro.component.html',
  styleUrl: './envelope-intro.component.scss'
})
export class EnvelopeIntroComponent implements OnInit, OnDestroy {
  private readonly translationService = inject(TranslationService);
  private readonly audioService = inject(AudioService);
  private readonly platformId = inject(PLATFORM_ID);

  public readonly enabled = input<boolean>(true);
  public readonly allowSkip = input<boolean>(true);
  public readonly introDismissed = output<void>();

  // Reactive data from existing TranslationService
  public readonly isHindi = this.translationService.isHindi;
  public readonly currentLang = this.translationService.currentLang;
  public readonly guestName = this.translationService.guestName;
  public readonly groomName = this.translationService.groomName;
  public readonly brideName = this.translationService.brideName;
  public readonly weddingDates = this.translationService.weddingDates;
  public readonly t = this.translationService.t;

  // Animation phase signals
  public readonly isOpening = signal<boolean>(false);
  public readonly isPressed = signal<boolean>(false);
  public readonly isSealBroken = signal<boolean>(false);
  public readonly isFlapOpen = signal<boolean>(false);
  public readonly isLightEmerging = signal<boolean>(false);
  public readonly isCardEmerging = signal<boolean>(false);
  public readonly isCardExpanded = signal<boolean>(false);
  public readonly isFadingOut = signal<boolean>(false);
  public readonly isIntroVisible = signal<boolean>(true);

  private timeoutIds: any[] = [];
  private isBrowser = false;

  ngOnInit(): void {
    this.isBrowser = isPlatformBrowser(this.platformId);
    if (this.isBrowser) {
      // Lock scroll while intro is visible
      document.body.style.overflow = 'hidden';
    }
  }

  ngOnDestroy(): void {
    this.clearAllTimers();
    if (this.isBrowser) {
      document.body.style.overflow = '';
    }
  }

  /**
   * Triggers the full 3.5s luxury envelope opening sequence
   */
  public openEnvelope(): void {
    if (this.isOpening()) return;

    // Check for reduced motion preference
    if (this.isBrowser && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.skipIntro();
      return;
    }

    this.isOpening.set(true);
    this.isPressed.set(true);

    // Start ambient background wedding music on direct user gesture
    try {
      this.audioService.play();
    } catch {
      // graceful fallback
    }

    // Timeline Step 1: Subtle press release & wax seal fracture (0 - 0.4s)
    this.timeoutIds.push(
      setTimeout(() => {
        this.isPressed.set(false);
        this.isSealBroken.set(true);
      }, 350)
    );

    // Timeline Step 2: Flap rotates backwards in 3D (0.9s - 1.6s)
    this.timeoutIds.push(
      setTimeout(() => {
        this.isFlapOpen.set(true);
      }, 950)
    );

    // Timeline Step 3: Warm golden light ray & flower petals emerge (1.4s - 2.2s)
    this.timeoutIds.push(
      setTimeout(() => {
        this.isLightEmerging.set(true);
      }, 1450)
    );

    // Timeline Step 4: Wedding invitation card slides upward (1.9s - 2.8s)
    this.timeoutIds.push(
      setTimeout(() => {
        this.isCardEmerging.set(true);
      }, 2950)
    );

    // Timeline Step 5: Card expands cinematically toward the screen (2.8s - 3.4s)
    this.timeoutIds.push(
      setTimeout(() => {
        this.isCardExpanded.set(true);
      }, 6800)
    );

    // Timeline Step 6: Smooth cross-fade into existing wedding invitation (3.4s - 3.8s)
    this.timeoutIds.push(
      setTimeout(() => {
        this.isFadingOut.set(true);
      }, 8900)
    );

    // Timeline Step 7: Transition complete, unmount intro (3.8s)
    this.timeoutIds.push(
      setTimeout(() => {
        this.openInvitation();
      }, 9300)
    );
  }

  /**
   * Instantly bypasses animation and reveals the existing wedding invitation
   */
  public skipIntro(): void {
    if (this.isFadingOut()) return;

    // Start music on user interaction if not already playing
    try {
      this.audioService.play();
    } catch {
      // safe
    }

    this.clearAllTimers();
    this.isFadingOut.set(true);

    this.timeoutIds.push(
      setTimeout(() => {
        this.openInvitation();
      }, 240)
    );
  }

  /**
   * Finalizes intro dismissal and unlocks page scrolling
   */
  private openInvitation(): void {
    this.clearAllTimers();
    if (this.isBrowser) {
      document.body.style.overflow = '';
      try {
        sessionStorage.setItem('wedding_envelope_opened', 'true');
      } catch {
        // safe fallback
      }
    }
    this.isIntroVisible.set(false);
    this.introDismissed.emit();
  }

  /**
   * Accessible keyboard activation (Enter or Space)
   */
  public onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ' || event.code === 'Space') {
      event.preventDefault();
      this.openEnvelope();
    }
  }

  public toggleLanguage(): void {
    this.translationService.toggleLanguage();
  }

  private clearAllTimers(): void {
    this.timeoutIds.forEach((id) => clearTimeout(id));
    this.timeoutIds = [];
  }
}
