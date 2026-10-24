import { Injectable, computed, inject, signal } from '@angular/core';
import { TRANSLATIONS } from '../data/wedding-data';
import { InviteConfig, InviteType, InvitedBySide, WeddingCoupleInfo, WeddingDay, WeddingTranslations } from '../models/wedding-event.model';
import { WeddingDataService } from './wedding-data.service';

export type Language = 'en' | 'hi';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private readonly weddingData = inject(WeddingDataService);
  private readonly STORAGE_KEY = 'wedding_invitation_lang';
  
  private readonly _lang = signal<Language>(this.getInitialLang());
  private readonly _inviteType = signal<InviteType>(this.getInitialInviteType());
  private readonly _invitedBy = signal<InvitedBySide>(this.getInitialInvitedBy());
  private readonly _guestName = signal<string | null>(this.getInitialGuestName());
  
  public readonly currentLang = this._lang.asReadonly();
  public readonly isHindi = computed(() => this._lang() === 'hi');
  
  public readonly inviteType = this._inviteType.asReadonly();
  public readonly invitedBy = this._invitedBy.asReadonly();
  public readonly guestName = this._guestName.asReadonly();
  
  public readonly activeConfig = computed<InviteConfig>(() => {
    const configs = this.weddingData.inviteConfigs();
    return configs[this._inviteType()] || configs.both;
  });

  public readonly t = computed<WeddingTranslations>(() => TRANSLATIONS[this._lang()]);
  
  public readonly couple = computed<WeddingCoupleInfo>(() => ({
    ...this.weddingData.couple(),
    weddingDatesEn: this.activeConfig().weddingDatesEn,
    weddingDatesHi: this.activeConfig().weddingDatesHi,
    targetCountdownDate: this.activeConfig().targetCountdownDate
  }));
  
  public readonly groomName = computed(() => 
    this._lang() === 'hi' ? this.weddingData.couple().groomHi : this.weddingData.couple().groom
  );
  
  public readonly brideName = computed(() => 
    this._lang() === 'hi' ? this.weddingData.couple().brideHi : this.weddingData.couple().bride
  );
  
  public readonly weddingDates = computed(() => 
    this._lang() === 'hi' ? this.activeConfig().weddingDatesHi : this.activeConfig().weddingDatesEn
  );
  
  public readonly days = computed<WeddingDay[]>(() => {
    const rawDays = this.activeConfig().days;
    const side = this._invitedBy();
    
    if (side === 'both') {
      return rawDays;
    }

    return rawDays.map(day => ({
      ...day,
      dayNameEn: side === 'bride' && day.dateKey === '2026-11-30'
        ? 'Day 1 — Sacred Beginnings & Mata Poojan'
        : day.dayNameEn,
      dayNameHi: side === 'bride' && day.dateKey === '2026-11-30'
        ? 'प्रथम दिवस — शुभारंभ एवं माता पूजन'
        : day.dayNameHi,
      events: day.events.filter(event => !event.sideTag || event.sideTag === side)
    }));
  });

  public readonly eventsSubheading = computed(() => 
    this._lang() === 'hi' ? this.activeConfig().eventsSubheadingHi : this.activeConfig().eventsSubheadingEn
  );

  private getInitialLang(): Language {
    if (typeof window !== 'undefined' && window.localStorage) {
      const saved = window.localStorage.getItem(this.STORAGE_KEY) as Language;
      if (saved === 'en' || saved === 'hi') {
        return saved;
      }
    }
    return 'en';
  }

  private getInitialInviteType(): InviteType {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const queryType = urlParams.get('invite') || urlParams.get('type') || urlParams.get('event') || urlParams.get('to');
      
      if (queryType) {
        const lower = queryType.toLowerCase();
        if (lower.includes('reception') || lower === 'dinner') {
          return 'reception';
        }
        if (lower.includes('1dec') || lower.includes('dec1') || lower.includes('dec-1') || lower === 'day2') {
          return 'dec1';
        }
        if (lower.includes('both') || lower.includes('all') || lower === 'full') {
          return 'both';
        }
      }

      // Check pathname (e.g. /reception, /1dec, /dec1)
      const pathname = window.location.pathname.toLowerCase();
      if (pathname.includes('/reception')) {
        return 'reception';
      }
      if (pathname.includes('/1dec') || pathname.includes('/dec1') || pathname.includes('/1-december')) {
        return 'dec1';
      }
    }
    return 'both';
  }

  private getInitialInvitedBy(): InvitedBySide {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const querySide = urlParams.get('invitedBy') || 
                        urlParams.get('invitedby') || 
                        urlParams.get('invited_by') || 
                        urlParams.get('side') || 
                        urlParams.get('by');
      
      if (querySide) {
        const lower = querySide.toLowerCase().trim();
        if (lower === 'groom' || lower === 'groomside' || lower === 'var') {
          return 'groom';
        }
        if (lower === 'bride' || lower === 'brideside' || lower === 'vadhu') {
          return 'bride';
        }
        if (lower === 'both' || lower === 'all') {
          return 'both';
        }
      }
    }
    return 'both';
  }

  private getInitialGuestName(): string | null {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      let guest = urlParams.get('guest') || urlParams.get('name') || urlParams.get('family');
      if (guest && guest.trim()) {
        try {
          const cleaned = guest.replace(/\+/g, ' ');
          return decodeURIComponent(cleaned).trim();
        } catch {
          return guest.replace(/\+/g, ' ').trim();
        }
      }
    }
    return null;
  }

  public setLanguage(lang: Language): void {
    this._lang.set(lang);
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        window.localStorage.setItem(this.STORAGE_KEY, lang);
      } catch (e) {
        // Safe fallback
      }
    }
    // Update HTML lang attribute
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang;
    }
  }

  public toggleLanguage(): void {
    const next = this._lang() === 'en' ? 'hi' : 'en';
    this.setLanguage(next);
  }

  public setInviteType(type: InviteType): void {
    this._inviteType.set(type);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (type === 'both') {
        url.searchParams.delete('invite');
        url.searchParams.delete('type');
      } else {
        url.searchParams.set('invite', type);
      }
      window.history.replaceState({}, '', url.toString());
    }
  }

  public setInvitedBy(side: InvitedBySide): void {
    this._invitedBy.set(side);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (side === 'both') {
        url.searchParams.delete('invitedBy');
        url.searchParams.delete('invitedby');
        url.searchParams.delete('side');
      } else {
        url.searchParams.set('invitedBy', side);
      }
      window.history.replaceState({}, '', url.toString());
    }
  }
}
