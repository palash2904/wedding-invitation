import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AdminAuthService } from '../../services/admin-auth.service';
import { InviteType, InvitedBySide, WeddingEvent } from '../../models/wedding-event.model';
import { WeddingDataService } from '../../services/wedding-data.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="admin-page-container">
      <!-- Background Ambient Glow -->
      <div class="admin-bg-glow" aria-hidden="true"></div>

      <!-- 1. LOGIN SCREEN (When Unauthenticated) -->
      <div *ngIf="!authService.isAuthenticated()" class="auth-wrapper">
        <div class="auth-card luxury-card">
          <div class="auth-header">
            <span class="auth-badge">🪔 Royal Wedding 🪔</span>
            <h1 class="auth-title">Admin Portal</h1>
            <p class="auth-subtitle">Palash & Sonam Wedding Invitation Management</p>
          </div>

          <form (ngSubmit)="onLogin()" class="login-form">
            <div class="input-group">
              <label for="adminPassword" class="form-label">Enter Admin Password</label>
              <div class="password-field-wrapper">
                <input
                  id="adminPassword"
                  name="adminPassword"
                  [type]="showPassword() ? 'text' : 'password'"
                  [(ngModel)]="passwordInput"
                  placeholder="Enter passcode"
                  class="admin-input"
                  autofocus
                  autocomplete="current-password"
                />
                <button
                  type="button"
                  class="password-toggle-btn"
                  (click)="togglePasswordVisibility()"
                  [attr.aria-label]="showPassword() ? 'Hide password' : 'Show password'"
                >
                  {{ showPassword() ? '👁️' : '🔒' }}
                </button>
              </div>
            </div>

            <div *ngIf="errorMessage()" class="error-alert" role="alert">
              ⚠️ {{ errorMessage() }}
            </div>

            <button type="submit" class="btn-royal submit-btn">
              <span>Unlock Admin Portal ➔</span>
            </button>
          </form>

          <div class="auth-footer">
            <a routerLink="/" class="back-link">
              ← Return to Public Wedding Invitation
            </a>
          </div>
        </div>
      </div>

      <!-- 2. ADMIN INVITATION MANAGEMENT PANEL (When Authenticated) -->
      <div *ngIf="authService.isAuthenticated()" class="admin-panel-wrapper">
        <!-- Top Admin Bar -->
        <header class="admin-nav-bar">
          <div class="admin-nav-content">
            <div class="admin-brand">
              <span class="brand-badge">👑 Admin Panel</span>
              <h2 class="brand-title">Palash & Sonam Wedding</h2>
            </div>

            <div class="admin-nav-actions">
              <a routerLink="/" target="_blank" class="nav-btn view-site-btn" title="View Public Invitation">
                <span class="btn-icon">👁️</span>
                <span class="btn-text">View Invitation</span>
              </a>
              <button type="button" class="nav-btn logout-btn" (click)="onLogout()" title="Log out">
                <span class="btn-icon">🚪</span>
                <span class="btn-text">Logout</span>
              </button>
            </div>
          </div>
        </header>

        <!-- Main Content Area -->
        <main class="admin-content-container">
          <!-- Intro Card -->
          <div class="intro-card luxury-card">
            <div class="intro-text">
              <span class="intro-badge">💌 WhatsApp Link Generator</span>
              <h1 class="intro-title">Share Wedding Invites</h1>
              <p class="intro-desc">
                Generate personalized WhatsApp messages and direct invitation links for your guests with ceremony filters.
              </p>
            </div>

            <!-- Guest Name Customizer & Language Selector -->
            <div class="controls-toolbar">
              <!-- Guest Name Input -->
              <div class="toolbar-item guest-input-item">
                <label for="guestInput" class="toolbar-label">
                  👤 Guest / Family Name (Optional):
                </label>
                <div class="guest-input-wrap">
                  <input
                    id="guestInput"
                    type="text"
                    [(ngModel)]="customGuestName"
                    placeholder="e.g. Sharma Family / Rahul Ji"
                    class="guest-text-input"
                  />
                  <button
                    *ngIf="customGuestName"
                    type="button"
                    class="clear-input-btn"
                    (click)="customGuestName = ''"
                    title="Clear name"
                    aria-label="Clear name"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <!-- Filter Toggles Row -->
              <div class="toolbar-row-split">
                <!-- Ceremony Side Selector -->
                <div class="toolbar-item side-toggle-item">
                  <label class="toolbar-label">
                    👑 Ceremony Side:
                  </label>
                  <div class="side-pill-group">
                    <button
                      type="button"
                      class="side-pill-btn"
                      [class.active]="selectedSide() === 'groom'"
                      (click)="selectedSide.set('groom')"
                    >
                      <span>🤵 Groom (वर पक्ष)</span>
                    </button>
                    <button
                      type="button"
                      class="side-pill-btn"
                      [class.active]="selectedSide() === 'bride'"
                      (click)="selectedSide.set('bride')"
                    >
                      <span>👰 Bride (वधू पक्ष)</span>
                    </button>
                  </div>
                </div>

                <!-- Message Language Selector -->
                <div class="toolbar-item lang-toggle-item">
                  <label class="toolbar-label">
                    🌐 Message Language:
                  </label>
                  <div class="lang-pill-group">
                    <button
                      type="button"
                      class="lang-pill-btn"
                      [class.active]="messageLang() === 'en'"
                      (click)="messageLang.set('en')"
                    >
                      English
                    </button>
                    <button
                      type="button"
                      class="lang-pill-btn hindi-text"
                      [class.active]="messageLang() === 'hi'"
                      (click)="messageLang.set('hi')"
                    >
                      हिंदी
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Edit Wedding Details: couple names, venue & full ceremony schedule -->
          <div class="intro-card luxury-card edit-card">
            <div class="intro-text">
              <span class="intro-badge">✏️ Edit Invitation Content</span>
              <h1 class="intro-title">Wedding Details & Schedule</h1>
              <p class="intro-desc">
                Change function names, timings, venues and couple details here. Changes preview instantly below and on
                "View Invitation" on <strong>this device</strong>. To make changes visible to every guest on every
                phone, use "Copy Config Code" at the bottom and send it to your developer to redeploy.
              </p>
            </div>

            <button type="button" class="edit-toggle-btn" (click)="isEditorOpen.set(!isEditorOpen())">
              <span>{{ isEditorOpen() ? '▲ Hide Editor' : '▼ Open Editor' }}</span>
              <span *ngIf="weddingData.hasOverrides()" class="edited-dot" title="Unsaved-to-code edits are live"
                >● edited</span
              >
            </button>

            <div *ngIf="isEditorOpen()" class="editor-body">
              <!-- Couple & Venue -->
              <div class="editor-block">
                <h4 class="editor-block-title">💑 Couple &amp; Main Venue</h4>
                <div class="editor-grid">
                  <label class="editor-field">
                    <span>Groom Name (EN)</span>
                    <input type="text" [(ngModel)]="coupleDraft.groom" class="admin-input-sm" />
                  </label>
                  <label class="editor-field">
                    <span>Groom Name (HI)</span>
                    <input type="text" [(ngModel)]="coupleDraft.groomHi" class="admin-input-sm hindi-text" />
                  </label>
                  <label class="editor-field">
                    <span>Bride Name (EN)</span>
                    <input type="text" [(ngModel)]="coupleDraft.bride" class="admin-input-sm" />
                  </label>
                  <label class="editor-field">
                    <span>Bride Name (HI)</span>
                    <input type="text" [(ngModel)]="coupleDraft.brideHi" class="admin-input-sm hindi-text" />
                  </label>
                  <label class="editor-field wide">
                    <span>Main Venue Name (EN)</span>
                    <input type="text" [(ngModel)]="coupleDraft.venueName" class="admin-input-sm" />
                  </label>
                  <label class="editor-field wide">
                    <span>Main Venue Name (HI)</span>
                    <input type="text" [(ngModel)]="coupleDraft.venueNameHi" class="admin-input-sm hindi-text" />
                  </label>
                  <label class="editor-field wide">
                    <span>Main Venue Address (EN)</span>
                    <input type="text" [(ngModel)]="coupleDraft.venueAddress" class="admin-input-sm" />
                  </label>
                  <label class="editor-field wide">
                    <span>Main Venue Address (HI)</span>
                    <input type="text" [(ngModel)]="coupleDraft.venueAddressHi" class="admin-input-sm hindi-text" />
                  </label>
                </div>
                <button type="button" class="btn-secondary save-btn" (click)="saveCouple()">💾 Save Couple &amp; Venue</button>
              </div>

              <!-- Per-day ceremony schedule -->
              <div class="editor-block" *ngFor="let day of weddingData.editableDays()">
                <h4 class="editor-block-title">🗓️ {{ day.dayNameEn }} — {{ day.dateFormattedEn }}</h4>

                <div class="editor-event-card" *ngFor="let ev of day.events">
                  <div class="editor-event-head">
                    <span class="editor-event-name">{{ ev.title }}</span>
                    <span *ngIf="ev.sideTagEn" class="editor-event-tag">{{ ev.sideTagEn }}</span>
                  </div>
                  <div class="editor-grid">
                    <label class="editor-field">
                      <span>Function Name (EN)</span>
                      <input type="text" [(ngModel)]="eventDrafts[day.dateKey + '::' + ev.id].title" class="admin-input-sm" />
                    </label>
                    <label class="editor-field">
                      <span>Function Name (HI)</span>
                      <input type="text" [(ngModel)]="eventDrafts[day.dateKey + '::' + ev.id].titleHi" class="admin-input-sm hindi-text" />
                    </label>
                    <label class="editor-field">
                      <span>Time (EN)</span>
                      <input type="text" [(ngModel)]="eventDrafts[day.dateKey + '::' + ev.id].time" class="admin-input-sm" placeholder="e.g. 7:00 PM" />
                    </label>
                    <label class="editor-field">
                      <span>Time (HI)</span>
                      <input type="text" [(ngModel)]="eventDrafts[day.dateKey + '::' + ev.id].timeHi" class="admin-input-sm hindi-text" placeholder="e.g. सायं 7:00 बजे" />
                    </label>
                    <label class="editor-field wide">
                      <span>Venue Name (EN)</span>
                      <input type="text" [(ngModel)]="eventDrafts[day.dateKey + '::' + ev.id].venueName" class="admin-input-sm" />
                    </label>
                    <label class="editor-field wide">
                      <span>Venue Name (HI)</span>
                      <input type="text" [(ngModel)]="eventDrafts[day.dateKey + '::' + ev.id].venueNameHi" class="admin-input-sm hindi-text" />
                    </label>
                  </div>
                  <div class="editor-event-actions">
                    <button type="button" class="btn-secondary save-btn" (click)="saveEvent(day.dateKey, ev.id)">
                      💾 Save
                    </button>
                    <button type="button" class="btn-secondary reset-btn" (click)="resetEvent(day.dateKey, ev.id)">
                      ↺ Reset
                    </button>
                  </div>
                </div>
              </div>

              <div class="editor-footer-actions">
                <button type="button" class="btn-secondary" (click)="resetAllOverrides()">↺ Reset All Edits</button>
                <button type="button" class="btn-secondary" (click)="copyExportJson()">
                  {{ copiedExport() ? '✓ Copied!' : '📋 Copy Config Code' }}
                </button>
              </div>
            </div>
          </div>

          <!-- 3 Invitation Categories Grid -->
          <div class="invitation-cards-grid">
            <!-- 1. Reception Only -->
            <div class="card-item luxury-card reception-card">
              <div class="card-top">
                <div class="card-header-badge reception">🍽️ 1. Reception Only</div>
                <h3 class="card-title">Royal Reception & Dinner</h3>
                <div class="card-schedule-pill">
                  📅 Tuesday, 1 Dec 2026 • 7:00 PM onwards
                </div>
                <p class="card-summary">
                  Curated for guests invited exclusively to the Evening Reception & Feast. Daytime ceremonies are hidden.
                </p>
              </div>

              <div class="card-url-preview">
                <span class="url-label">URL:</span>
                <code class="url-code" [title]="getInviteUrl('reception')">{{ getInviteUrl('reception') }}</code>
              </div>

              <div class="card-action-buttons">
                <button
                  type="button"
                  class="btn-royal action-copy-btn"
                  (click)="copyWhatsAppMessage('reception')"
                >
                  <span>{{ copiedType() === 'reception' ? '✓ WhatsApp Message Copied!' : '📋 Copy WhatsApp Invite' }}</span>
                </button>
                <div class="secondary-btn-row">
                  <button
                    type="button"
                    class="btn-secondary"
                    (click)="copyLinkOnly('reception')"
                  >
                    🔗 Copy Link
                  </button>
                  <a
                    [href]="getInviteUrl('reception')"
                    target="_blank"
                    class="btn-secondary"
                  >
                    👁️ Preview
                  </a>
                </div>
              </div>
            </div>

            <!-- 2. 1 December Only -->
            <div class="card-item luxury-card dec1-card">
              <div class="card-top">
                <div class="card-header-badge dec1">💍 2. 1 December Full Day</div>
                <h3 class="card-title">Complete Day 2 Celebrations</h3>
                <div class="card-schedule-pill">
                  📅 Tuesday, 1 Dec 2026 • 10:30 AM to Late Night
                </div>
                <p class="card-summary">
                  Includes Engagement (10:30 AM), Haldi (1:00 PM), Var Nikasi (6:00 PM), and Reception (7:00 PM onwards).
                </p>
              </div>

              <div class="card-url-preview">
                <span class="url-label">URL:</span>
                <code class="url-code" [title]="getInviteUrl('dec1')">{{ getInviteUrl('dec1') }}</code>
              </div>

              <div class="card-action-buttons">
                <button
                  type="button"
                  class="btn-royal action-copy-btn"
                  (click)="copyWhatsAppMessage('dec1')"
                >
                  <span>{{ copiedType() === 'dec1' ? '✓ WhatsApp Message Copied!' : '📋 Copy WhatsApp Invite' }}</span>
                </button>
                <div class="secondary-btn-row">
                  <button
                    type="button"
                    class="btn-secondary"
                    (click)="copyLinkOnly('dec1')"
                  >
                    🔗 Copy Link
                  </button>
                  <a
                    [href]="getInviteUrl('dec1')"
                    target="_blank"
                    class="btn-secondary"
                  >
                    👁️ Preview
                  </a>
                </div>
              </div>
            </div>

            <!-- 3. Both Days -->
            <div class="card-item luxury-card both-card">
              <div class="card-top">
                <div class="card-header-badge both">❤️ 3. Both Days (Full Event)</div>
                <h3 class="card-title">Complete 2-Day Wedding Festivities</h3>
                <div class="card-schedule-pill">
                  📅 30 Nov & 1 Dec 2026 • Full Schedule
                </div>
                <p class="card-summary">
                  Complete schedule: Mata Poojan (Groom & Bride), Mamera, Sangeet, Ring Ceremony, Haldi, Baraat & Royal Reception.
                </p>
              </div>

              <div class="card-url-preview">
                <span class="url-label">URL:</span>
                <code class="url-code" [title]="getInviteUrl('both')">{{ getInviteUrl('both') }}</code>
              </div>

              <div class="card-action-buttons">
                <button
                  type="button"
                  class="btn-royal action-copy-btn"
                  (click)="copyWhatsAppMessage('both')"
                >
                  <span>{{ copiedType() === 'both' ? '✓ WhatsApp Message Copied!' : '📋 Copy WhatsApp Invite' }}</span>
                </button>
                <div class="secondary-btn-row">
                  <button
                    type="button"
                    class="btn-secondary"
                    (click)="copyLinkOnly('both')"
                  >
                    🔗 Copy Link
                  </button>
                  <a
                    [href]="getInviteUrl('both')"
                    target="_blank"
                    class="btn-secondary"
                  >
                    👁️ Preview
                  </a>
                </div>
              </div>
            </div>
          </div>

          <!-- Toast Notification Banner -->
          <div *ngIf="feedbackToast()" class="feedback-toast-banner" role="status">
            ✨ {{ feedbackToast() }}
          </div>
        </main>
      </div>
    </div>
  `,
  styles: [`
    *, *::before, *::after {
      box-sizing: border-box;
    }

    .admin-page-container {
      min-height: 100vh;
      width: 100%;
      max-width: 100vw;
      background: linear-gradient(180deg, #FDFBF7 0%, #FAF6EE 50%, #F5ECDD 100%);
      color: #2E2520;
      position: relative;
      overflow-x: hidden;
      padding-bottom: 3rem;
      box-sizing: border-box;
    }

    .admin-bg-glow {
      position: fixed;
      top: -150px;
      right: -80px;
      width: min(500px, 80vw);
      height: min(500px, 80vw);
      border-radius: 50%;
      background: radial-gradient(circle, rgba(243, 217, 159, 0.3) 0%, rgba(197, 160, 89, 0.08) 60%, transparent 80%);
      pointer-events: none;
      filter: blur(50px);
      z-index: 0;
    }

    /* AUTH LOGIN SCREEN */
    .auth-wrapper {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1.5rem 1rem;
      position: relative;
      z-index: 2;
      width: 100%;
      box-sizing: border-box;
    }

    .auth-card {
      max-width: 440px;
      width: 100%;
      background: rgba(255, 255, 255, 0.96);
      border: 1.5px solid rgba(197, 160, 89, 0.45);
      border-radius: 24px;
      padding: 2.5rem 2rem;
      box-shadow: 0 20px 50px -10px rgba(122, 25, 43, 0.12), 0 6px 24px rgba(197, 160, 89, 0.18);
      text-align: center;
      box-sizing: border-box;
    }

    .auth-header {
      margin-bottom: 1.75rem;
    }

    .auth-badge {
      display: inline-block;
      font-size: 0.78rem;
      font-weight: 700;
      color: #7A192B;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      margin-bottom: 0.5rem;
    }

    .auth-title {
      font-size: clamp(1.75rem, 5vw, 2.2rem);
      color: #7A192B;
      font-weight: 700;
      margin-bottom: 0.35rem;
    }

    .auth-subtitle {
      font-size: 0.9rem;
      color: #6E6259;
      line-height: 1.4;
    }

    .login-form {
      display: flex;
      flex-direction: column;
      gap: 1.2rem;
      text-align: left;
      width: 100%;
    }

    .form-label {
      font-size: 0.85rem;
      font-weight: 600;
      color: #2E2520;
      display: block;
      margin-bottom: 0.4rem;
    }

    .password-field-wrapper {
      position: relative;
      display: flex;
      align-items: center;
      width: 100%;
    }

    .admin-input {
      width: 100%;
      padding: 12px 46px 12px 14px;
      border: 1.5px solid #C5A059;
      border-radius: 12px;
      font-family: inherit;
      font-size: 0.95rem;
      background: #FAF6EF;
      color: #2E2520;
      outline: none;
      transition: all 0.25s ease;
      box-sizing: border-box;
    }

    .admin-input:focus {
      background: #FFFFFF;
      border-color: #7A192B;
      box-shadow: 0 0 0 3px rgba(122, 25, 43, 0.12);
    }

    .password-toggle-btn {
      position: absolute;
      right: 10px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 1.1rem;
      opacity: 0.75;
      padding: 6px;
      border-radius: 6px;
      transition: opacity 0.2s;
    }

    .password-toggle-btn:hover {
      opacity: 1;
    }

    .error-alert {
      padding: 10px 14px;
      background: #FDF0F0;
      border: 1px solid #E88080;
      border-radius: 10px;
      color: #9E263E;
      font-size: 0.85rem;
      font-weight: 600;
    }

    .submit-btn {
      width: 100%;
      margin-top: 0.25rem;
      font-size: 0.95rem;
      padding: 12px 20px;
      min-height: 46px;
    }

    .auth-footer {
      margin-top: 1.75rem;
      padding-top: 1.2rem;
      border-top: 1px dashed rgba(197, 160, 89, 0.3);
    }

    .back-link {
      font-size: 0.85rem;
      color: #7A192B;
      font-weight: 600;
      transition: color 0.2s ease;
    }

    .back-link:hover {
      text-decoration: underline;
      color: #560F1D;
    }

    /* AUTHENTICATED ADMIN PANEL */
    .admin-panel-wrapper {
      position: relative;
      z-index: 2;
      width: 100%;
      max-width: 100vw;
    }

    /* TOP ADMIN NAVBAR */
    .admin-nav-bar {
      background: rgba(255, 255, 255, 0.97);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border-bottom: 1.5px solid rgba(197, 160, 89, 0.35);
      position: sticky;
      top: 0;
      z-index: 100;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
      width: 100%;
    }

    .admin-nav-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0.75rem 1.25rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.75rem;
      box-sizing: border-box;
      width: 100%;
    }

    .admin-brand {
      display: flex;
      flex-direction: column;
      min-width: 0;
    }

    .brand-badge {
      font-size: 0.68rem;
      font-weight: 700;
      color: #7A192B;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      line-height: 1.2;
    }

    .brand-title {
      font-size: clamp(1.05rem, 2.8vw, 1.3rem);
      color: #7A192B;
      font-weight: 700;
      margin: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .admin-nav-actions {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-shrink: 0;
    }

    .nav-btn {
      padding: 7px 14px;
      border-radius: 9999px;
      font-size: 0.82rem;
      font-weight: 600;
      transition: all 0.2s ease;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      text-decoration: none;
      white-space: nowrap;
      line-height: 1.2;
    }

    .btn-icon {
      font-size: 0.9rem;
      display: inline-block;
    }

    .view-site-btn {
      background: #FAF4EB;
      color: #7A192B;
      border: 1px solid rgba(197, 160, 89, 0.5);
    }

    .view-site-btn:hover {
      background: #C5A059;
      color: #FFFFFF;
      border-color: #C5A059;
    }

    .logout-btn {
      background: rgba(122, 25, 43, 0.08);
      color: #7A192B;
      border: 1px solid rgba(122, 25, 43, 0.2);
    }

    .logout-btn:hover {
      background: #7A192B;
      color: #FFFFFF;
      border-color: #7A192B;
    }

    /* MAIN ADMIN CONTENT */
    .admin-content-container {
      max-width: 1200px;
      margin: 1.5rem auto 0 auto;
      padding: 0 1.25rem;
      width: 100%;
      box-sizing: border-box;
    }

    .intro-card {
      background: rgba(255, 255, 255, 0.95);
      border: 1.5px solid rgba(197, 160, 89, 0.35);
      border-radius: 20px;
      padding: 1.75rem 1.5rem;
      margin-bottom: 1.5rem;
      box-sizing: border-box;
      width: 100%;
    }

    .intro-badge {
      display: inline-block;
      font-size: 0.75rem;
      font-weight: 700;
      color: #7A192B;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      margin-bottom: 0.35rem;
    }

    .intro-title {
      font-size: clamp(1.5rem, 4vw, 2.2rem);
      color: #7A192B;
      font-weight: 700;
      margin-bottom: 0.35rem;
    }

    .intro-desc {
      font-size: clamp(0.88rem, 2vw, 0.98rem);
      color: #5C4E47;
      line-height: 1.45;
      margin-bottom: 1.25rem;
    }

    /* CONTROLS TOOLBAR */
    .controls-toolbar {
      display: flex;
      flex-direction: column;
      gap: 1.1rem;
      padding: 1.25rem;
      background: #FAF6EF;
      border: 1px solid rgba(197, 160, 89, 0.3);
      border-radius: 16px;
      box-sizing: border-box;
      width: 100%;
    }

    .toolbar-row-split {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
      width: 100%;
      box-sizing: border-box;
    }

    .toolbar-item {
      display: flex;
      flex-direction: column;
      gap: 6px;
      width: 100%;
      min-width: 0;
      box-sizing: border-box;
    }

    .guest-input-item {
      width: 100%;
    }

    .toolbar-label {
      font-size: 0.82rem;
      font-weight: 600;
      color: #2E2520;
    }

    .guest-input-wrap {
      position: relative;
      display: flex;
      align-items: center;
      width: 100%;
      box-sizing: border-box;
    }

    .guest-text-input {
      width: 100%;
      padding: 10px 36px 10px 14px;
      border-radius: 10px;
      border: 1.5px solid #C5A059;
      font-family: inherit;
      font-size: 0.92rem;
      background: #FFFFFF;
      outline: none;
      box-sizing: border-box;
      transition: all 0.2s ease;
    }

    .guest-text-input:focus {
      border-color: #7A192B;
      box-shadow: 0 0 0 3px rgba(122, 25, 43, 0.1);
    }

    .clear-input-btn {
      position: absolute;
      right: 8px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 0.85rem;
      color: #8A7A70;
      padding: 6px 8px;
      border-radius: 50%;
      cursor: pointer;
    }

    .clear-input-btn:hover {
      color: #7A192B;
    }

    .side-pill-group,
    .lang-pill-group {
      display: flex;
      width: 100%;
      background: #EFE7DA;
      padding: 3px;
      border-radius: 12px;
      border: 1px solid rgba(197, 160, 89, 0.4);
      box-sizing: border-box;
      gap: 4px;
    }

    .side-pill-btn,
    .lang-pill-btn {
      flex: 1;
      min-width: 0;
      padding: 8px 10px;
      border-radius: 9px;
      font-size: 0.82rem;
      font-weight: 600;
      color: #5C4E47;
      transition: all 0.2s ease;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      cursor: pointer;
      line-height: 1.25;
    }

    .side-pill-btn span {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .side-pill-btn.active,
    .lang-pill-btn.active {
      background: #7A192B;
      color: #FFFFFF;
      box-shadow: 0 2px 6px rgba(122, 25, 43, 0.25);
    }

    /* CARDS GRID */
    .invitation-cards-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.25rem;
      margin-bottom: 2rem;
      width: 100%;
      box-sizing: border-box;
    }

    @media (max-width: 980px) {
      .invitation-cards-grid {
        grid-template-columns: 1fr;
      }
    }

    .card-item {
      background: #FFFFFF;
      border: 1.5px solid rgba(197, 160, 89, 0.35);
      border-radius: 18px;
      padding: 1.5rem 1.25rem;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      gap: 1.1rem;
      box-sizing: border-box;
      width: 100%;
      transition: transform 0.25s ease, box-shadow 0.25s ease;
    }

    .card-item:hover {
      transform: translateY(-2px);
      box-shadow: 0 12px 30px -6px rgba(122, 25, 43, 0.12), 0 4px 14px rgba(197, 160, 89, 0.18);
    }

    .card-header-badge {
      display: inline-block;
      font-size: 0.76rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      margin-bottom: 0.4rem;
    }

    .card-header-badge.reception { color: #9E263E; }
    .card-header-badge.dec1 { color: #8A5E12; }
    .card-header-badge.both { color: #7A192B; }

    .card-title {
      font-size: clamp(1.15rem, 2.5vw, 1.3rem);
      color: #2E2520;
      font-weight: 700;
      margin-bottom: 0.35rem;
      line-height: 1.3;
    }

    .card-schedule-pill {
      font-size: 0.78rem;
      font-weight: 600;
      color: #7A192B;
      background: #FAF4EB;
      border: 1px solid rgba(197, 160, 89, 0.3);
      border-radius: 6px;
      padding: 4px 8px;
      display: inline-block;
      margin-bottom: 0.6rem;
      line-height: 1.3;
      word-break: break-word;
    }

    .card-summary {
      font-size: 0.85rem;
      color: #5C4E47;
      line-height: 1.45;
    }

    .card-url-preview {
      background: #FAF6EF;
      border: 1px solid rgba(197, 160, 89, 0.25);
      border-radius: 8px;
      padding: 7px 10px;
      font-size: 0.74rem;
      display: flex;
      gap: 6px;
      align-items: center;
      width: 100%;
      min-width: 0;
      box-sizing: border-box;
      overflow: hidden;
    }

    .url-label {
      font-weight: 700;
      color: #7A192B;
      flex-shrink: 0;
    }

    .url-code {
      color: #5C4E47;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      font-family: monospace;
      flex: 1;
      min-width: 0;
    }

    .card-action-buttons {
      display: flex;
      flex-direction: column;
      gap: 8px;
      width: 100%;
      box-sizing: border-box;
    }

    .action-copy-btn {
      width: 100%;
      padding: 11px 14px;
      font-size: 0.88rem;
      min-height: 44px;
      box-sizing: border-box;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      text-align: center;
    }

    .secondary-btn-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
      width: 100%;
      box-sizing: border-box;
    }

    .btn-secondary {
      width: 100%;
      padding: 8px 10px;
      border: 1px solid #C5A059;
      border-radius: 9999px;
      background: #FAF4EB;
      color: #7A192B;
      font-size: 0.8rem;
      font-weight: 600;
      text-align: center;
      transition: all 0.2s ease;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 4px;
      min-height: 38px;
      box-sizing: border-box;
      white-space: nowrap;
    }

    .btn-secondary:hover {
      background: #C5A059;
      color: #FFFFFF;
    }

    /* FEEDBACK TOAST BANNER */
    .feedback-toast-banner {
      position: fixed;
      bottom: 1.25rem;
      left: 50%;
      transform: translateX(-50%);
      width: auto;
      max-width: calc(100vw - 2rem);
      z-index: 1000;
      background: #1A130C;
      color: #F3D99F;
      padding: 10px 20px;
      border-radius: 9999px;
      font-size: 0.88rem;
      font-weight: 600;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
      border: 1px solid rgba(197, 160, 89, 0.4);
      animation: popInToast 0.25s cubic-bezier(0.16, 1, 0.3, 1);
      box-sizing: border-box;
      text-align: center;
    }

    @keyframes popInToast {
      from { opacity: 0; transform: translate(-50%, 12px) scale(0.96); }
      to { opacity: 1; transform: translate(-50%, 0) scale(1); }
    }

    /* RESPONSIVE BREAKPOINTS */
    @media (max-width: 640px) {
      .auth-card {
        padding: 2rem 1.25rem;
        border-radius: 20px;
      }

      .admin-nav-content {
        padding: 0.65rem 0.85rem;
        gap: 0.5rem;
      }

      .brand-badge {
        font-size: 0.62rem;
      }

      .brand-title {
        font-size: 0.95rem;
      }

      .nav-btn {
        padding: 6px 10px;
        font-size: 0.75rem;
        gap: 4px;
      }

      .admin-content-container {
        padding: 0 0.75rem;
        margin-top: 1rem;
      }

      .intro-card {
        padding: 1.25rem 0.9rem;
        border-radius: 16px;
        margin-bottom: 1rem;
      }

      .intro-badge {
        font-size: 0.7rem;
      }

      .controls-toolbar {
        padding: 0.9rem 0.75rem;
        gap: 0.85rem;
        border-radius: 12px;
      }

      .toolbar-row-split {
        grid-template-columns: 1fr;
        gap: 0.85rem;
      }

      .side-pill-btn,
      .lang-pill-btn {
        padding: 7px 6px;
        font-size: 0.78rem;
      }

      .card-item {
        padding: 1.25rem 0.9rem;
        border-radius: 16px;
        gap: 1rem;
      }

      .card-title {
        font-size: 1.15rem;
      }

      .action-copy-btn {
        font-size: 0.85rem;
        padding: 10px 12px;
      }

      .btn-secondary {
        font-size: 0.78rem;
        padding: 7px 6px;
      }
    }

    @media (max-width: 380px) {
      .brand-title {
        font-size: 0.88rem;
      }

      .view-site-btn .btn-text {
        display: none;
      }

      .logout-btn .btn-text {
        display: none;
      }

      .nav-btn {
        padding: 6px 9px;
      }

      .side-pill-btn span {
        font-size: 0.72rem;
      }
    }

    /* ===== Wedding Details Editor ===== */
    .edit-card {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .edit-toggle-btn {
      align-self: flex-start;
      display: inline-flex;
      align-items: center;
      gap: 10px;
      padding: 10px 18px;
      border-radius: 10px;
      border: 1.5px solid #C5A059;
      background: #FAF6EF;
      color: #7A192B;
      font-weight: 700;
      font-size: 0.88rem;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .edit-toggle-btn:hover {
      background: #7A192B;
      color: #FFF;
    }

    .edited-dot {
      font-size: 0.72rem;
      color: #16794A;
      font-weight: 600;
    }

    .editor-body {
      display: flex;
      flex-direction: column;
      gap: 1.1rem;
      padding-top: 0.4rem;
      border-top: 1px dashed rgba(197, 160, 89, 0.4);
    }

    .editor-block {
      background: #FFFDF9;
      border: 1px solid rgba(197, 160, 89, 0.35);
      border-radius: 14px;
      padding: 1rem 1.1rem;
      display: flex;
      flex-direction: column;
      gap: 0.85rem;
    }

    .editor-block-title {
      margin: 0;
      font-size: 1rem;
      font-weight: 700;
      color: #7A192B;
    }

    .editor-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.7rem;
    }

    .editor-field {
      display: flex;
      flex-direction: column;
      gap: 4px;
      font-size: 0.78rem;
      font-weight: 600;
      color: #6E5C54;
    }

    .editor-field.wide {
      grid-column: 1 / -1;
    }

    .admin-input-sm {
      width: 100%;
      padding: 9px 12px;
      border: 1.5px solid #D9C9A8;
      border-radius: 9px;
      font-family: inherit;
      font-size: 0.88rem;
      background: #FFFFFF;
      color: #2E2520;
      outline: none;
      box-sizing: border-box;
      transition: all 0.2s ease;
    }

    .admin-input-sm:focus {
      border-color: #7A192B;
      box-shadow: 0 0 0 3px rgba(122, 25, 43, 0.1);
    }

    .save-btn,
    .reset-btn {
      width: auto;
      padding: 8px 16px;
      font-size: 0.8rem;
    }

    .editor-event-card {
      background: rgba(197, 160, 89, 0.06);
      border: 1px solid rgba(197, 160, 89, 0.25);
      border-radius: 12px;
      padding: 0.85rem 0.9rem;
      display: flex;
      flex-direction: column;
      gap: 0.7rem;
    }

    .editor-event-head {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }

    .editor-event-name {
      font-weight: 700;
      color: #2E2520;
      font-size: 0.92rem;
    }

    .editor-event-tag {
      font-size: 0.68rem;
      padding: 2px 8px;
      border-radius: 999px;
      background: rgba(122, 25, 43, 0.1);
      color: #7A192B;
      font-weight: 600;
    }

    .editor-event-actions {
      display: flex;
      gap: 8px;
    }

    .editor-footer-actions {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
      padding-top: 0.3rem;
    }

    @media (max-width: 640px) {
      .editor-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class AdminComponent {
  public readonly authService = inject(AdminAuthService);
  private readonly router = inject(Router);
  public readonly weddingData = inject(WeddingDataService);

  public passwordInput = '';
  public showPassword = signal<boolean>(false);
  public errorMessage = signal<string | null>(null);

  public customGuestName = '';
  public messageLang = signal<'en' | 'hi'>('en');
  public selectedSide = signal<'groom' | 'bride'>('groom');
  public copiedType = signal<InviteType | null>(null);
  public feedbackToast = signal<string | null>(null);

  // --- Wedding details editor state ---
  public isEditorOpen = signal<boolean>(false);
  public copiedExport = signal<boolean>(false);
  public coupleDraft = { ...this.weddingData.couple() };
  public eventDrafts: Record<
    string,
    { title: string; titleHi: string; time: string; timeHi: string; venueName: string; venueNameHi: string }
  > = {};

  constructor() {
    this.initEventDrafts();
  }

  private initEventDrafts(): void {
    this.weddingData.editableDays().forEach((day) => {
      day.events.forEach((ev: WeddingEvent) => {
        const key = `${day.dateKey}::${ev.id}`;
        this.eventDrafts[key] = {
          title: ev.title,
          titleHi: ev.titleHi,
          time: ev.time,
          timeHi: ev.timeHi || '',
          venueName: ev.venueName || '',
          venueNameHi: ev.venueNameHi || ''
        };
      });
    });
  }

  public saveCouple(): void {
    this.weddingData.updateCouple({ ...this.coupleDraft });
    this.showToast('Couple & venue details saved — refresh "View Invitation" to see it!');
  }

  public saveEvent(dateKey: string, eventId: string): void {
    const key = `${dateKey}::${eventId}`;
    const draft = this.eventDrafts[key];
    if (!draft) return;
    this.weddingData.updateEvent(dateKey, eventId, { ...draft });
    this.showToast('Function details saved!');
  }

  public resetEvent(dateKey: string, eventId: string): void {
    this.weddingData.resetEvent(dateKey, eventId);
    this.initEventDrafts();
    this.showToast('Reset to default.');
  }

  public resetAllOverrides(): void {
    this.weddingData.resetAll();
    this.coupleDraft = { ...this.weddingData.couple() };
    this.initEventDrafts();
    this.showToast('All edits reset to default.');
  }

  public copyExportJson(): void {
    const json = this.weddingData.exportOverridesAsJson();
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(json).then(() => {
        this.copiedExport.set(true);
        setTimeout(() => this.copiedExport.set(false), 3000);
      });
    }
  }

  public togglePasswordVisibility(): void {
    this.showPassword.update((v) => !v);
  }

  public onLogin(): void {
    this.errorMessage.set(null);
    const success = this.authService.login(this.passwordInput);
    if (success) {
      this.passwordInput = '';
      this.errorMessage.set(null);
    } else {
      this.errorMessage.set('Invalid admin password. Please try again.');
    }
  }

  public onLogout(): void {
    this.authService.logout();
    this.passwordInput = '';
    this.errorMessage.set(null);
  }

  public getBasePublicUrl(): string {
    if (typeof window === 'undefined') return '';
    const origin = window.location.origin;
    const path = window.location.pathname.replace(/\/admin\/?$/, '');
    return `${origin}${path || ''}/`;
  }

  public getInviteUrl(type: 'reception' | 'dec1' | 'both'): string {
    const base = this.getBasePublicUrl();
    const params: string[] = [];

    if (type === 'reception') {
      params.push('type=reception');
    } else if (type === 'dec1') {
      params.push('type=dec1');
    }

    params.push(`invitedBy=${this.selectedSide()}`);

    const guest = this.customGuestName.trim();
    if (guest) {
      params.push(`guest=${encodeURIComponent(guest)}`);
    }

    return `${base}?${params.join('&')}`;
  }

  public copyLinkOnly(type: 'reception' | 'dec1' | 'both'): void {
    const link = this.getInviteUrl(type);
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(link).then(() => {
        this.showToast(`Copied direct link for ${type === 'reception' ? 'Reception' : type === 'dec1' ? '1 Dec' : 'Both Days'}!`);
      });
    }
  }

  public copyWhatsAppMessage(type: InviteType): void {
    if (typeof window === 'undefined') return;

    const isHi = this.messageLang() === 'hi';
    const guest = this.customGuestName.trim();
    const guestGreeting = guest
      ? (isHi ? `सादर आमंत्रण: *${guest}*\n\n` : `Cordially Invited: *${guest}*\n\n`)
      : '';

    const inviteUrl = this.getInviteUrl(type);
    let messageText = '';

    if (type === 'reception') {
      messageText = isHi
        ? `✨ *शाही प्रीतिभोज निमंत्रण* ✨\n\n${guestGreeting}।। श्री गणेशाय नमः ।।\n\nपरमपिता परमात्मा की असीम कृपा से, *पलाश एवं सोनम* के शुभ विवाह के पावन उपलक्ष्य में आयोजित *शाही प्रीतिभोज (रिसेप्शन)* में आप सपरिवार सादर आमंत्रित हैं।\n\n📅 *दिनांक:* मंगलवार, 1 दिसंबर 2026\n🕖 *समय:* सायं 7:00 बजे से\n📍 *स्थान:* महावीर बाग, एयरपोर्ट रोड, अग्रसेन नगर, इंदौर (म.प्र. 452006)\n\nआपकी गरिमामयी उपस्थिति एवं पावन शुभाशीर्वाद हमारे लिए अत्यंत हर्ष का विषय होगी।\n\n💌 *डिजिटल निमंत्रण पत्र देखें:* \n${inviteUrl}`
        : `✨ *Wedding Reception Invitation* ✨\n\n${guestGreeting}Together with their families, *Palash & Sonam* cordially invite you to celebrate their *Royal Wedding Reception & Dinner*!\n\n📅 *Date:* Tuesday, 1 December 2026\n🕖 *Time:* 7:00 PM onwards\n📍 *Venue:* Mahaveer Bagh, Airport Road, Agrasen Nagar, Indore (M.P. 452006)\n\n💌 *View Interactive Invitation:* \n${inviteUrl}`;
    } else if (type === 'dec1') {
      messageText = isHi
        ? `✨ *शुभ विवाह निमंत्रण* ✨\n\n${guestGreeting}।। श्री गणेशाय नमः ।।\n\n*पलाश एवं सोनम* के मांगलिक विवाह समारोह के पावन अवसर पर आप सपरिवार सादर आमंत्रित हैं।\n\n📅 *दिनांक:* मंगलवार, 1 दिसंबर 2026\n\n🌸 *मांगलिक कार्यक्रम:* \n• प्रातः 10:30 बजे — सगाई समारोह (रिंग सेरेमनी)\n• दोपहर 1:00 बजे — शुभ हल्दी उत्सव\n• सायं 6:00 बजे — वर निकासी (शाही बारात)\n• सायं 7:00 बजे से — स्वागत समारोह एवं रात्रिभोज\n\n📍 *स्थान:* महावीर बाग, एयरपोर्ट रोड, अग्रसेन नगर, इंदौर (म.प्र. 452006)\n\nइस शुभ अवसर पर पधारकर नवदंपति को अपना स्नेह एवं शुभाशीर्वाद प्रदान करें।\n\n💌 *डिजिटल निमंत्रण पत्र देखें:* \n${inviteUrl}`
        : `✨ *Wedding Invitation* ✨\n\n${guestGreeting}Together with their families, *Palash & Sonam* invite you to celebrate their auspicious wedding ceremonies on *Tuesday, 1 December 2026*!\n\n📅 *Schedule:* \n• 10:30 AM — Engagement Ceremony\n• 1:00 PM — Haldi Ceremony\n• 6:00 PM — Var Nikasi (Royal Baraat)\n• 7:00 PM onwards — Reception & Dinner Feast\n\n📍 *Venue:* Mahaveer Bagh, Airport Road, Agrasen Nagar, Indore (M.P. 452006)\n\n💌 *View Interactive Invitation:* \n${inviteUrl}`;
    } else {
      const isBride = this.selectedSide() === 'bride';

      const day1EventsHi = isBride
        ? '• प्रातः 10:00 बजे — माता पूजन (गृह निवास: 45 नंदा नगर, इंदौर)'
        : '• प्रातः 10:00 बजे — माता पूजन (गृह निवास: 31/8 वृंदावन कॉलोनी, इंदौर)\n• दोपहर 1:00 बजे — मामेरा (भात) [महावीर बाग]\n• सायं 7:00 बजे — महिला संगीत एवं सुरमयी संध्या [महावीर बाग]';

      const day1EventsEn = isBride
        ? '• 10:00 AM — Mata Poojan (Residence: 45 Nanda Nagar, Indore)'
        : '• 10:00 AM — Mata Poojan (Residence: 31/8 Vrindavan Colony, Indore)\n• 1:00 PM — Mamera (Mahaveer Bagh)\n• 7:00 PM — Sangeet Night (Mahaveer Bagh)';

      messageText = isHi
        ? `✨ *मांगलिक विवाह निमंत्रण* ✨\n\n${guestGreeting}।। श्री गणेशाय नमः ।।\n\n*पलाश एवं सोनम* के विवाह महोत्सव में आप सपरिवार सादर आमंत्रित हैं।\n\n🌸 *सोमवार, 30 नवंबर 2026:* \n${day1EventsHi}\n\n🌸 *मंगलवार, 1 दिसंबर 2026:* \n• प्रातः 10:30 बजे — सगाई समारोह [महावीर बाग]\n• दोपहर 1:00 बजे — मांगलिक हल्दी उत्सव [महावीर बाग]\n• सायं 6:00 बजे — वर निकासी (शाही बारात)\n• सायं 7:00 बजे से — स्वागत समारोह एवं रात्रिभोज [महावीर बाग]\n\n📍 *मुख्य विवाह स्थल:* महावीर बाग, एयरपोर्ट रोड, अग्रसेन नगर, इंदौर (म.प्र. 452006)\n\nआपकी गरिमामयी उपस्थिति से हमारे उत्सव की शोभा बढ़ेगी।\n\n💌 *डिजिटल निमंत्रण पत्र देखें:* \n${inviteUrl}`
        : `✨ *Royal Wedding Invitation* ✨\n\n${guestGreeting}Together with their families, *Palash & Sonam* invite you to celebrate their wedding festivities!\n\n🌸 *Monday, 30 November 2026:* \n${day1EventsEn}\n\n🌸 *Tuesday, 1 December 2026:* \n• 10:30 AM — Engagement Ceremony (Mahaveer Bagh)\n• 1:00 PM — Haldi Celebration (Mahaveer Bagh)\n• 6:00 PM — Var Nikasi (Baraat)\n• 7:00 PM onwards — Reception / Dinner (Mahaveer Bagh)\n\n📍 *Main Wedding Venue:* Mahaveer Bagh, Airport Road, Agrasen Nagar, Indore (M.P. 452006)\n\n💌 *View Interactive Invitation:* \n${inviteUrl}`;
    }

    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(messageText).then(() => {
        this.copiedType.set(type);
        this.showToast(`Copied WhatsApp Invite for ${type === 'reception' ? 'Reception' : type === 'dec1' ? '1 Dec' : 'Both Days'}!`);
        setTimeout(() => {
          this.copiedType.set(null);
        }, 3000);
      });
    }
  }

  private showToast(msg: string): void {
    this.feedbackToast.set(msg);
    setTimeout(() => {
      this.feedbackToast.set(null);
    }, 3500);
  }
}
