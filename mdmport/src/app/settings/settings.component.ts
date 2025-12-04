import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { SettingsService, Settings, Density } from '../services/settings.service';

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

  form!: FormGroup;

  ngOnInit(): void {
    const current = this.settingsService.settings;

    this.form = this.fb.group({
      density: [current.density as Density],
      showTips: [current.showTips],
    });

    this.form.valueChanges.subscribe((value: any) => {
      const patch: Partial<Settings> = {
        density: value.density as Density,
        showTips: !!value.showTips,
      };
      this.settingsService.update(patch);
    });
  }

  resetToDefaults() {
    this.settingsService.resetToDefaults();
    const def = this.settingsService.settings;
    this.form.setValue(
      {
        density: def.density,
        showTips: def.showTips,
      },
      { emitEvent: false }
    );
  }
}
