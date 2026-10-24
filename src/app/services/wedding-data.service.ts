import { Injectable, signal, computed } from '@angular/core';
import { INVITE_CONFIGS as DEFAULT_INVITE_CONFIGS, WEDDING_COUPLE as DEFAULT_COUPLE } from '../data/wedding-data';
import { InviteConfig, InviteType, WeddingCoupleInfo, WeddingDay } from '../models/wedding-event.model';

export interface EventOverride {
  title?: string;
  titleHi?: string;
  time?: string;
  timeHi?: string;
  venueName?: string;
  venueNameHi?: string;
  venueAddress?: string;
  venueAddressHi?: string;
}

interface StoredOverrides {
  couple?: Partial<WeddingCoupleInfo>;
  events?: Record<string, EventOverride>;
}

/**
 * Central source of truth for editable wedding content (couple names, venue,
 * ceremony schedule). Defaults come from wedding-data.ts; anything the admin
 * edits is saved as a small "overrides" patch in this browser's localStorage
 * and layered on top of the defaults every time the app reads the data.
 *
 * NOTE: localStorage is per-browser/per-device. Edits made here update the
 * live preview instantly on this device, but a guest opening the invite link
 * on their own phone will NOT see them (there's no shared backend). Use the
 * "Copy config as code" export in the admin panel to bake permanent changes
 * into wedding-data.ts and redeploy so every guest sees them.
 */
@Injectable({ providedIn: 'root' })
export class WeddingDataService {
  private readonly STORAGE_KEY = 'wedding_admin_overrides_v1';

  private readonly overrides = signal<StoredOverrides>(this.loadOverrides());

  public readonly couple = computed<WeddingCoupleInfo>(() => ({
    ...DEFAULT_COUPLE,
    ...(this.overrides().couple || {})
  }));

  public readonly inviteConfigs = computed<Record<InviteType, InviteConfig>>(() => {
    const evOverrides = this.overrides().events || {};
    const applyDay = (day: WeddingDay): WeddingDay => ({
      ...day,
      events: day.events.map((ev) => {
        const patch = evOverrides[`${day.dateKey}::${ev.id}`];
        return patch ? { ...ev, ...patch } : ev;
      })
    });

    const result = {} as Record<InviteType, InviteConfig>;
    (Object.keys(DEFAULT_INVITE_CONFIGS) as InviteType[]).forEach((key) => {
      const cfg = DEFAULT_INVITE_CONFIGS[key];
      result[key] = { ...cfg, days: cfg.days.map(applyDay) };
    });
    return result;
  });

  /** Full unique schedule (both days) — used by the admin editor UI. */
  public readonly editableDays = computed<WeddingDay[]>(() => this.inviteConfigs()['both'].days);

  public readonly hasOverrides = computed<boolean>(() => {
    const ov = this.overrides();
    return !!(ov.couple && Object.keys(ov.couple).length) || !!(ov.events && Object.keys(ov.events).length);
  });

  private loadOverrides(): StoredOverrides {
    if (typeof window === 'undefined' || !window.localStorage) return {};
    try {
      const raw = window.localStorage.getItem(this.STORAGE_KEY);
      return raw ? (JSON.parse(raw) as StoredOverrides) : {};
    } catch {
      return {};
    }
  }

  private persist(next: StoredOverrides): void {
    this.overrides.set(next);
    if (typeof window === 'undefined' || !window.localStorage) return;
    try {
      window.localStorage.setItem(this.STORAGE_KEY, JSON.stringify(next));
    } catch {
      // safe fallback — in-memory signal still updates for this session
    }
  }

  public updateEvent(dateKey: string, eventId: string, patch: EventOverride): void {
    const key = `${dateKey}::${eventId}`;
    const current = this.overrides();
    this.persist({
      ...current,
      events: { ...(current.events || {}), [key]: { ...(current.events?.[key] || {}), ...patch } }
    });
  }

  public updateCouple(patch: Partial<WeddingCoupleInfo>): void {
    const current = this.overrides();
    this.persist({ ...current, couple: { ...(current.couple || {}), ...patch } });
  }

  public resetEvent(dateKey: string, eventId: string): void {
    const key = `${dateKey}::${eventId}`;
    const current = this.overrides();
    if (!current.events || !(key in current.events)) return;
    const nextEvents = { ...current.events };
    delete nextEvents[key];
    this.persist({ ...current, events: nextEvents });
  }

  public resetAll(): void {
    this.persist({});
  }

  /** JSON snapshot of just the admin's edits — for backup/debugging. */
  public exportOverridesAsJson(): string {
    return JSON.stringify(this.overrides(), null, 2);
  }
}
