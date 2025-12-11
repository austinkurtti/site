import { effect, Injectable, signal } from '@angular/core';
import { LocalStorageService } from './local-storage.service';

export enum ThemeSettings {
    SyncWithBrowser = 'syncWithBrowser',
    Theme = 'theme'
}

@Injectable({
    providedIn: 'root'
})
export class ThemeService {
    private readonly _localStoragePrefix = 'theme';

    public syncWithBrowser = signal(false);
    public theme = signal('light');

    private _themeOverride = false;

    constructor() {
        this._syncThemeSettingsWithLocalStorage();

        // Watch for any setting changes and re-apply theme
        effect(() => {
            // Only update local storage if this isn't a theme override
            if (!this._themeOverride) {
                this._updateSettingInLocalStorage(ThemeSettings.SyncWithBrowser, this.syncWithBrowser());
                this._updateSettingInLocalStorage(ThemeSettings.Theme, this.theme());
            }

            this._applyTheme();
        });

        // Do first theme application
        this._applyTheme();
    }

    public themeOverride(theme: string): void {
        this._themeOverride = true;
        this.theme.set(theme);
    }

    public removeThemeOverride(): void {
        this._themeOverride = false;
        this._syncThemeSettingsWithLocalStorage();
    }

    private _getStorageKey(setting: ThemeSettings): string {
        // Re-use old 'theme' key for base setting, otherwise use prefix
        return setting === ThemeSettings.Theme
            ? setting
            : `${this._localStoragePrefix}_${setting}`;
    }

    private _getSettingFromLocalStorage(setting: ThemeSettings): any {
        let value = LocalStorageService.getItem(this._getStorageKey(setting));

        // Get the default value if no entry exists
        if (value === null) {
            switch (setting) {
                case ThemeSettings.SyncWithBrowser:
                    value = false;
                    break;
                case ThemeSettings.Theme:
                    value = 'light';
                    break;
            }
        }

        // Migrate old theme values
        if (setting === ThemeSettings.Theme && typeof value === 'boolean') {
            value = value ? 'dark' : 'light';
        }

        return value;
    }

    private _syncThemeSettingsWithLocalStorage(): void {
        // Sync signals with local storage
        this.syncWithBrowser.set(this._getSettingFromLocalStorage(ThemeSettings.SyncWithBrowser));
        this.theme.set(this._getSettingFromLocalStorage(ThemeSettings.Theme));
    }

    private _updateSettingInLocalStorage(setting: ThemeSettings, value: any): void {
        LocalStorageService.setItem(this._getStorageKey(setting), value);
    }

    private _applyTheme(): void {
        if (this.syncWithBrowser()) {
            document.documentElement.setAttribute('data-theme', 'sync');
        } else {
            document.documentElement.setAttribute('data-theme', this.theme());
        }
    }
}
