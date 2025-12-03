import { Injectable } from '@angular/core';

export type Theme = 'light' | 'dark';
export type Density = 'comfortable' | 'compact';

export interface AppSettings {
  theme: Theme;
  density: Density;
  showTips: boolean;
}

const STORAGE_KEY = 'app-settings-v1';

@Injectable({ providedIn: 'root' })
export class SettingsService {
  private settings: AppSettings = this.load();

  get current(): AppSettings {
    return this.settings;
  }

  update(partial: Partial<AppSettings>) {
    this.settings = { ...this.settings, ...partial };
    this.save();
    this.applyToDocument();
  }

  private load(): AppSettings {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return {
          theme: 'dark',
          density: 'comfortable',
          showTips: true,
        };
      }
      const parsed = JSON.parse(raw) as AppSettings;
      return {
        theme: parsed.theme ?? 'dark',
        density: parsed.density ?? 'comfortable',
        showTips: parsed.showTips ?? true,
      };
    } catch {
      return {
        theme: 'dark',
        density: 'comfortable',
        showTips: true,
      };
    }
  }

  private save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.settings));
  }

  /** opcionális: body class-ek beállítása */
  applyToDocument() {
    const body = document.body;
    body.classList.toggle('theme-dark', this.settings.theme === 'dark');
    body.classList.toggle('theme-light', this.settings.theme === 'light');

    body.classList.toggle('density-compact', this.settings.density === 'compact');
    body.classList.toggle('density-comfortable', this.settings.density === 'comfortable');
  }
}
