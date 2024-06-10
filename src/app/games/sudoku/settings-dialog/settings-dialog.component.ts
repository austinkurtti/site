import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ToggleComponent } from '@components/toggle/toggle.component';
import { DialogBase } from '@directives/dialog/dialog-base';
import { TooltipDirective } from '@directives/tooltip/tooltip.directive';
import { LocalStorageService } from '@services/local-storage.service';
import { SudokuManager } from '../sudoku-manager';

@Component({
    standalone: true,
    imports: [
        CommonModule,
        ToggleComponent,
        TooltipDirective
    ],
    selector: 'ak-settings-dialog',
    styleUrls: ['./settings-dialog.component.scss'],
    templateUrl: './settings-dialog.component.html'
})
export class SettingsDialogComponent extends DialogBase {
    public gameManager = inject(SudokuManager);

    public erasePencilDescription = 'After entering a number, any conflicting penciled in values in the same row, column and 3x3 square will be erased';
    public disableInputsDescription = 'Number inputs will be disabled when the count for their values reaches nine';
    public exitSaveDescription = 'Sudoku progress will be automatically saved when exiting the game';

    public toggleChange(setting: string, value: boolean): void {
        LocalStorageService.setItem(`${this.gameManager.localStoragePrefix}_${setting}`, value);
    }
}
