import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { SettingsService } from '../services/settings.service';

export type Theme = 'light' | 'dark';
export type Density = 'comfortable' | 'compact';

export interface Settings {
  theme: Theme;
  density: Density;
  showTips: boolean;
}

export const DEFAULT_SETTINGS: Settings = {
  theme: 'dark',
  density: 'comfortable',
  showTips: true,
};

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
})
export class SettingsComponent implements OnInit {
  private fb = inject(FormBuilder);
  private settingsService = inject(SettingsService);

  form = this.fb.group({
    theme: ['dark'],
    density: ['comfortable'],
    showTips: [true],
  });

  ngOnInit(): void {
    const current = this.settingsService.current;
    this.form.patchValue(current);

    this.form.valueChanges.subscribe(value => {
      if (!value) return;
      this.settingsService.update({
        theme: value.theme as any,
        density: value.density as any,
        showTips: !!value.showTips,
      });
    });
  }

  resetToDefaults() {
    this.form.setValue({
      theme: 'dark',
      density: 'comfortable',
      showTips: true,
    });
  }
}
