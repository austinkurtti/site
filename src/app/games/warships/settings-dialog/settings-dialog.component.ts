import { Component, inject } from '@angular/core';
import { ToggleComponent } from '@components/toggle/toggle.component';
import { DialogDirective } from '@directives/dialog/dialog.directive';
import { LocalStorageService } from '@services/local-storage.service';
import { WarshipsManager } from '../warships-manager';

@Component({
    selector: 'ak-warships-settings-dialog',
    templateUrl: './settings-dialog.component.html',
    imports: [
        ToggleComponent
    ]
})
export class WarshipsSettingsDialogComponent extends DialogDirective {
    public gameManager = inject(WarshipsManager);

    public toggleChange(setting: string, value: boolean): void {
        LocalStorageService.setItem(`${this.gameManager.localStoragePrefix}_${setting}`, value);
    }
}
