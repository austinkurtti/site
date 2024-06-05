import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ToggleComponent } from '@components/toggle/toggle.component';
import { DialogBase } from '@directives/dialog/dialog-base';
import { LocalStorageService } from '@services/local-storage.service';

@Component({
    standalone: true,
    imports: [
        CommonModule,
        ToggleComponent
    ],
    selector: 'ak-settings-dialog',
    styleUrls: ['./settings-dialog.component.scss'],
    templateUrl: './settings-dialog.component.html'
})
export class SettingsDialogComponent extends DialogBase {
    @Input() hardcore: boolean;
    @Input() showClock: boolean;
    @Input() showConflicts: boolean;
    @Input() autoPencilErase: boolean;
    @Input() autoDisableInputs: boolean;

    public toggleChange(setting: string, value: boolean): void {
        LocalStorageService.setItem(setting, value);
    }
}
