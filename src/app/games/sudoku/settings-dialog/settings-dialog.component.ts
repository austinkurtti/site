import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ToggleComponent } from '@components/toggle/toggle.component';
import { DialogBase } from '@directives/dialog/dialog-base';
import { LocalStorageService } from '@services/local-storage.service';
import { SudokuManager } from '../sudoku-manager';

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
    public gameManager = inject(SudokuManager);

    public toggleChange(setting: string, value: boolean): void {
        LocalStorageService.setItem(`${this.gameManager.localStoragePrefix}_${setting}`, value);
    }
}
