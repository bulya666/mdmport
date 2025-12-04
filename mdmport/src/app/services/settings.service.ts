import { Injectable } from '@angular/core';

export type Density = 'comfortable' | 'compact';

export interface Settings {
  density: Density;
  showTips: boolean;
}

const STORAGE_KEY = 'mdmport-settings';

const DEFAULT_SETTINGS: Settings = {
  density: 'comfortable',
  showTips: true,
};

@Injectable({ providedIn: 'root' })
export class SettingsService {
  private _settings: Settings = this.loadFromStorage();

  get settings(): Settings {
    return this._settings;
  }

  update(partial: Partial<Settings>) {
    this._settings = { ...this._settings, ...partial };
    this.saveToStorage(this._settings);
    this.applyToDom(this._settings);
  }

  resetToDefaults() {
    this._settings = { ...DEFAULT_SETTINGS };
    this.saveToStorage(this._settings);
    this.applyToDom(this._settings);
  }

  // ---- privát ----

  private loadFromStorage(): Settings {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        this.applyToDom(DEFAULT_SETTINGS);
        return { ...DEFAULT_SETTINGS };
      }
      const parsed = JSON.parse(raw) as Settings;
      const merged: Settings = {
        ...DEFAULT_SETTINGS,
        ...parsed,
      };
      this.applyToDom(merged);
      return merged;
    } catch {
      this.applyToDom(DEFAULT_SETTINGS);
      return { ...DEFAULT_SETTINGS };
    }
  }

  private saveToStorage(settings: Settings) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }

  private applyToDom(settings: Settings) {
    const body = document.body;

    body.classList.remove('density-comfortable', 'density-compact');
    body.classList.add(`density-${settings.density}`);

    if (settings.showTips) {
      body.classList.add('show-tips');
    } else {
      body.classList.remove('show-tips');
    }
  }
}
