import { Component, Input } from '@angular/core';
import { ToggleComponent } from '@components/toggle/toggle.component';
import { DialogBase } from '@directives/dialog/dialog-base';
import { LocalStorageService } from '@services/local-storage.service';

@Component({
    standalone: true,
    imports: [
        ToggleComponent
    ],
    selector: 'ak-settings-dialog',
    styleUrls: ['./settings-dialog.component.scss'],
    templateUrl: './settings-dialog.component.html'
})
export class SettingsDialogComponent extends DialogBase {
    @Input() showClock: boolean;
    @Input() showConflicts: boolean;

    public toggleChange(setting: string, value: boolean): void {
        LocalStorageService.setItem(setting, value);
    }
}
