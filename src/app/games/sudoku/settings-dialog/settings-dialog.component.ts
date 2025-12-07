import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ThemeComponent } from '@components/theme/theme.component';
import { ToggleComponent } from '@components/toggle/toggle.component';
import { DialogDirective } from '@directives/dialog/dialog.directive';
import { LocalStorageService } from '@services/local-storage.service';
import { SudokuManager } from '../sudoku-manager';

@Component({
    selector: 'ak-settings-dialog',
    styleUrls: ['./settings-dialog.component.scss'],
    templateUrl: './settings-dialog.component.html',
    imports: [
        CommonModule,
        ThemeComponent,
        ToggleComponent
    ],
})
export class SettingsDialogComponent extends DialogDirective {
    public gameManager = inject(SudokuManager);

    public toggleChange(setting: string, value: boolean): void {
        LocalStorageService.setItem(`${this.gameManager.localStoragePrefix}_${setting}`, value);
    }
}
