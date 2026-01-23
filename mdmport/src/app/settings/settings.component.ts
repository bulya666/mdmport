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
  loggedUser: string | null = null;
  
  userSettings: UserSettings = {
  username: '',
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
    this.loggedUser = localStorage.getItem("loggedUser");

    if (!this.loggedUser) {
      console.warn('Nincs bejelentkezve – beállítások nem töltődnek');
      this.router.navigate(['/login']);
      return;
    }
    else {
      console.log('Bejelentkezett felhasználó (localStorage):', this.loggedUser);
      this.userSettings.username = this.loggedUser;
    }
    if (this.loggedUser) {
      this.loadUserSettings();
      this.loadPreferencesFromLocal();
    }

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
    private loadUserSettings() {
    const username = localStorage.getItem('loggedUser');
    if (username) {
      this.userSettings.username = username;
      this.http.get(`/api/users/byname/${username}`, { withCredentials: true })
        .subscribe({
          next: (user: any) => {
            this.userSettings = {
              username: user.username,
            };
          },
          error: (err) => this.showMessage('Hiba a felhasználói adatok betöltésekor', 'error')
        });
    }
  }
  private loadPreferencesFromLocal() {
    const saved = localStorage.getItem('userPreferences');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        this.preferences = { ...this.preferences, ...parsed };
        console.log('Preferenciák betöltve localStorage-ból');
      } catch (err) {
        console.error('Hibás formátumú userPreferences a localStorage-ban', err);
      }
    } else {
      console.log('Nincsenek mentett preferenciák → alapértelmezett értékek maradnak');
    }
  }

  selectTab(tab: TabType) {
    this.activeTab = tab;
  }

saveProfileChanges() {
  if (!this.validateProfileForm()) return;

  if (!this.userSettings.newPassword?.trim()) {
    this.showMessage('Adj meg új jelszót a módosításhoz', 'error');
    return;
  }

  this.isLoading = true;

  const payload = {
    currentPassword: this.userSettings.currentPassword?.trim() || '',
    newPassword: this.userSettings.newPassword.trim(),
  };

  const username = this.userSettings.username || localStorage.getItem('loggedUser');

  if (!username) {
    this.showMessage('Nincs bejelentkezve – próbáld újra', 'error');
    this.isLoading = false;
    return;
  }
this.http
  .put(`/api/users/${username}/password`, payload, { withCredentials: true })
    .subscribe({
      next: () => {
        this.showMessage('Jelszó sikeresen megváltoztatva!', 'success');
        this.userSettings.currentPassword = '';
        this.userSettings.newPassword = '';
        this.userSettings.confirmPassword = '';
      },
      error: (err) => {
        let msg = 'Hiba a jelszó módosításakor';
        if (err.status === 401) msg = 'Hibás jelenlegi jelszó';
        else if (err.status === 400) msg = err.error?.message || msg;
        else if (err.error?.message) msg = err.error.message;

        this.showMessage(msg, 'error');
      },
      complete: () => (this.isLoading = false),
    });
}
  savePreferences() {
    if (!this.loggedUser) {
    this.showMessage('Nincs bejelentkezve – mentés sikertelen', 'error');
    return;
  }
    this.isLoading = true;
    const username = localStorage.getItem('loggedUser');
    localStorage.setItem('userPreferences', JSON.stringify(this.preferences));
    this.showMessage('Beállítások mentve!', 'success');
    this.isLoading = false;
    
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
  if (!password?.trim()) {
    this.showMessage('Jelszó megadása kötelező a törléshez', 'error');
    return;
  }

  if (!confirm('Biztosan törölni szeretnéd a fiókot?\nEz a művelet NEM visszavonható!')) {
    return;
  }

  this.isLoading = true;

  const username = localStorage.getItem('loggedUser') || this.userSettings.username;

  if (!username) {
    this.showMessage('Nincs bejelentkezett felhasználó', 'error');
    this.isLoading = false;
    return;
  }

  const payload = {
    currentPassword: password.trim(),
  };
  
  this.http.delete(`/api/users/${username}`, {                                      
    body: { currentPassword: password.trim() },
    withCredentials: true,
  })
    .subscribe({
      next: () => {
        localStorage.removeItem('loggedUser');
        localStorage.removeItem('userPreferences');
        this.showMessage('Fiók sikeresen törölve. Átirányítás...', 'success');
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1800);
      },
      error: (err) => {
        let msg = 'Hiba a fiók törlésekor';
        if (err.status === 401) {
          msg = 'Hibás jelszó – a fiók nem törölhető';
        } else if (err.error?.message) {
          msg = err.error.message;
        }
        this.showMessage(msg, 'error');
      },
      complete: () => (this.isLoading = false),
    });
}

    private validateProfileForm(): boolean {
    if (!this.userSettings.username) {
      this.showMessage('Felhasználónév megadása szükséges', 'error');
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
