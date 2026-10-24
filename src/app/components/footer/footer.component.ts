import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="wedding-footer" role="contentinfo">
      <div class="footer-container">
        <!-- Floating Diya / Lotus Emblem -->
        <div class="footer-emblem" aria-hidden="true">
          <span class="emblem-lotus">🪷</span>
        </div>

        <p class="footer-names">
          {{ groomName() }} & {{ brideName() }}
        </p>

        <p class="footer-love-tag">
          {{ t().footer.madeWithLove }}
        </p>

        <p class="footer-year">
          © {{ t().footer.year }}
        </p>
      </div>
    </footer>
  `,
  styles: [`
    .wedding-footer {
      background: #1F1713;
      color: #EFE4D6;
      padding: 3.5rem 1.5rem 2.5rem 1.5rem;
      text-align: center;
      position: relative;
      overflow: hidden;
      border-top: 2px solid rgba(197, 160, 89, 0.4);
    }

    .footer-container {
      max-width: 600px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
    }

    .footer-emblem {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: rgba(197, 160, 89, 0.15);
      border: 1px solid rgba(197, 160, 89, 0.4);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 0.5rem;
    }

    .emblem-lotus {
      font-size: 1.4rem;
    }

    .footer-names {
      font-family: var(--font-heading);
      font-size: 1.6rem;
      font-weight: 600;
      color: #F3D99F;
      letter-spacing: 0.04em;
    }

    .footer-love-tag {
      font-size: 0.92rem;
      color: #C2B4A8;
      font-weight: 400;
      margin-bottom: 0.25rem;
    }

    .footer-year {
      font-size: 0.85rem;
      color: #8C7C70;
      letter-spacing: 0.08em;
    }
  `]
})
export class FooterComponent {
  private translationService = inject(TranslationService);

  public readonly t = this.translationService.t;
  public readonly groomName = this.translationService.groomName;
  public readonly brideName = this.translationService.brideName;
}
