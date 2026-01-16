import { Component, OnInit, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormBuilder, FormGroup } from "@angular/forms";
import { SettingsService, Settings, Density} from "../services/settings.service";
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

type TabType = 'profile' | 'preferences' | 'privacy' | 'danger';

interface UserSettings {
  username: string;
  email: string;
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

interface Preferences {
  emailNotifications: boolean;
  pushNotifications: boolean;
  profilePublic: boolean;
  showActivity: boolean;
  allowMessaging: boolean;
}

@Component({
  selector: "app-settings",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: "./settings.component.html",
  styleUrls: ["./settings.component.css"],
})
export class SettingsComponent implements OnInit {
  private fb = inject(FormBuilder);
  private settingsService = inject(SettingsService);
  private http = inject(HttpClient);
  private router = inject(Router);
  form!: FormGroup;

  userSettings: UserSettings = {
  username: '',
  email: '',
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
  };

  preferences: Preferences = {
    emailNotifications: true,
    pushNotifications: false,
    profilePublic: true,
    showActivity: true,
    allowMessaging: true
  };

  activeTab: TabType = 'profile';
  isLoading = false;
  message = { type: '', text: '', visible: false };
  passwordVisible = false;
  confirmPasswordVisible = false;
  tabs: TabType[] = ['profile', 'preferences', 'privacy', 'danger'];
  tabLabels: Record<TabType, string> = {
    profile: '👤 Profil',
    preferences: '⚙️ Beállítások',
    privacy: '🔒 Adatvédelem',
    danger: '⚠️ Veszélyes'
  };

  ngOnInit(): void {
    const current = this.settingsService.settings;
    this.loadUserSettings();
    this.loadPreferences();

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
    private loadUserSettings() {
    const username = localStorage.getItem('loggedUser');
    if (username) {
      this.http.get(`/api/users/byname/${username}`, { withCredentials: true })
        .subscribe({
          next: (user: any) => {
            this.userSettings = {
              username: user.username,
              email: user.email || ''
            };
          },
          error: (err) => this.showMessage('Hiba a felhasználói adatok betöltésekor', 'error')
        });
    }
  }

  private loadPreferences() {
    const username = localStorage.getItem('loggedUser');
    if (!username) {
      console.warn('Nincs bejelentkezve');
      return;
    }
  console.log('Beállítások betöltése:', username);

    // Backend-ből töltjük be a beállításokat
    this.http.get(`/api/users/${username}/preferences`, { withCredentials: true })
      .subscribe({
        next: (prefs: any) => {
          console.log('Beállítások betöltve:', prefs);
          this.preferences = { ...this.preferences, ...prefs };
        },
        error: (err) => {
          console.error('Hiba a beállítások betöltésekor:', err);
          console.log('Status:', err.status);
          console.log('Message:', err.message);
          const saved = localStorage.getItem('userPreferences');
          if (saved) {
            console.log('Fallback: lokális tárolóból töltöm');
            this.preferences = JSON.parse(saved);
          }
        }
      });
  }

  selectTab(tab: TabType) {
    this.activeTab = tab;
  }

  saveProfileChanges() {
    if (!this.validateProfileForm()) return;

    this.isLoading = true;
    const payload = {
      username: this.userSettings.username,
      email: this.userSettings.email,
      ...(this.userSettings.newPassword && {
        currentPassword: this.userSettings.currentPassword,
        newPassword: this.userSettings.newPassword
      })
    };

    this.http.put(`/api/users/${this.userSettings.username}`, payload, { withCredentials: true })
      .subscribe({
        next: () => {
          localStorage.setItem('loggedUser', this.userSettings.username);
          this.showMessage('Profil sikeresen módosítva!', 'success');
          this.userSettings.currentPassword = '';
          this.userSettings.newPassword = '';
          this.userSettings.confirmPassword = '';
        },
        error: (err) => this.showMessage(err.error?.message || 'Hiba a profil mentésekor', 'error'),
        complete: () => this.isLoading = false
      });
  }
  savePreferences() {
    this.isLoading = true;
    const username = localStorage.getItem('loggedUser');
    
    if (!username) {
      this.showMessage('Felhasználó nem található', 'error');
      this.isLoading = false;
      return;
    }

    this.http.put(`/api/users/${username}/preferences`, this.preferences, { withCredentials: true })
      .subscribe({
        next: () => {
          localStorage.setItem('userPreferences', JSON.stringify(this.preferences));
          this.showMessage('Beállítások mentve!', 'success');
        },
        error: (err) => {
          console.error('Beállítások mentési hiba:', err);
          this.showMessage(err.error?.message || 'Hiba a beállítások mentésekor', 'error');
        },
        complete: () => this.isLoading = false
      });
  }

  deleteAccount(password: string) {
    if (!password.trim()) {
      this.showMessage('Jelszó megadása szükséges', 'error');
      return;
    }

    if (!confirm('Biztosan törölni szeretnéd a fiókot? Ez nem vonható vissza!')) return;

    this.isLoading = true;
    const username = localStorage.getItem('loggedUser');
    
    this.http.delete(`/api/users/${username}`, {
      body: { password },
      withCredentials: true
    })
      .subscribe({
        next: () => {
          localStorage.removeItem('loggedUser');
          localStorage.removeItem('userPreferences');
          this.showMessage('Fiók törölve. Átirányítás...', 'success');
          setTimeout(() => this.router.navigate(['/login']), 2000);
        },
        error: (err) => {
          console.error('Fiók törlési hiba:', err);
          this.showMessage(err.error?.message || 'Hiba a fiók törléskor', 'error');
        },
        complete: () => this.isLoading = false
      });
  }

    private validateProfileForm(): boolean {
    if (!this.userSettings.username || !this.userSettings.email) {
      this.showMessage('Felhasználónév és email megadása szükséges', 'error');
      return false;
    }

    if (this.userSettings.newPassword) {
      if (!this.userSettings.currentPassword) {
        this.showMessage('Jelenlegi jelszó szükséges az új jelszóhoz', 'error');
        return false;
      }
      if (this.userSettings.newPassword !== this.userSettings.confirmPassword) {
        this.showMessage('Az új jelszavak nem egyeznek', 'error');
        return false;
      }
      if (this.userSettings.newPassword.length < 6) {
        this.showMessage('Jelszó legalább 6 karakter hosszú legyen', 'error');
        return false;
      }
    }

    return true;
  }

  private showMessage(text: string, type: 'success' | 'error') {
    this.message = { type, text, visible: true };
    setTimeout(() => this.message.visible = false, 4000);
  }

  togglePasswordVisibility(field: 'password' | 'confirmPassword') {
    if (field === 'password') this.passwordVisible = !this.passwordVisible;
    else this.confirmPasswordVisible = !this.confirmPasswordVisible;
  }

  resetToDefaults() {
    this.settingsService.resetToDefaults();
    const def = this.settingsService.settings;
    this.form.setValue(
      {
        density: def.density,
        showTips: def.showTips,
      },
      { emitEvent: false },
    );
  }
}
