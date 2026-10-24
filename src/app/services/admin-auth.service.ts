import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AdminAuthService {
  private readonly STORAGE_KEY = 'wedding_admin_authenticated';
  private readonly STORAGE_TIME_KEY = 'wedding_admin_login_time';
  
  // 2 hours session expiry in milliseconds
  private readonly SESSION_DURATION_MS = 2 * 60 * 60 * 1000; // 2 hours = 7,200,000 ms
  
  // Default admin passwords accepted
  private readonly VALID_PASSWORDS = ['wedding2026'];

  public readonly isAuthenticated = signal<boolean>(this.getInitialAuthState());
  private logoutTimer: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    // If initially authenticated, schedule auto-logout for the remaining duration
    if (this.isAuthenticated()) {
      this.scheduleAutoLogout();
    }
  }

  private getInitialAuthState(): boolean {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const isAuth = window.localStorage.getItem(this.STORAGE_KEY) === 'true';
        const loginTimeStr = window.localStorage.getItem(this.STORAGE_TIME_KEY);

        if (isAuth && loginTimeStr) {
          const loginTime = parseInt(loginTimeStr, 10);
          const now = Date.now();
          const elapsed = now - loginTime;

          if (!isNaN(loginTime) && elapsed < this.SESSION_DURATION_MS) {
            return true;
          }
        }

        // Clean up expired session
        this.clearStorage();
        return false;
      } catch {
        return false;
      }
    }
    return false;
  }

  public login(password: string): boolean {
    const trimmed = password.trim();
    if (!trimmed) {
      return false;
    }

    const isValid = this.VALID_PASSWORDS.some(
      (valid) => valid.toLowerCase() === trimmed.toLowerCase()
    );

    if (isValid) {
      const now = Date.now();
      this.isAuthenticated.set(true);

      if (typeof window !== 'undefined' && window.localStorage) {
        try {
          window.localStorage.setItem(this.STORAGE_KEY, 'true');
          window.localStorage.setItem(this.STORAGE_TIME_KEY, now.toString());
        } catch {
          // localStorage fallback
        }
      }

      this.scheduleAutoLogout();
      return true;
    }

    return false;
  }

  public logout(): void {
    if (this.logoutTimer) {
      clearTimeout(this.logoutTimer);
      this.logoutTimer = null;
    }

    this.isAuthenticated.set(false);
    this.clearStorage();
  }

  private scheduleAutoLogout(): void {
    if (this.logoutTimer) {
      clearTimeout(this.logoutTimer);
      this.logoutTimer = null;
    }

    if (typeof window === 'undefined') return;

    try {
      const loginTimeStr = window.localStorage.getItem(this.STORAGE_TIME_KEY);
      const loginTime = loginTimeStr ? parseInt(loginTimeStr, 10) : Date.now();
      const elapsed = Date.now() - loginTime;
      const remaining = Math.max(0, this.SESSION_DURATION_MS - elapsed);

      if (remaining <= 0) {
        this.logout();
      } else {
        this.logoutTimer = setTimeout(() => {
          this.logout();
        }, remaining);
      }
    } catch {
      this.logoutTimer = setTimeout(() => {
        this.logout();
      }, this.SESSION_DURATION_MS);
    }
  }

  private clearStorage(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        window.localStorage.removeItem(this.STORAGE_KEY);
        window.localStorage.removeItem(this.STORAGE_TIME_KEY);
      } catch {
        // localStorage fallback
      }
    }
  }
}
