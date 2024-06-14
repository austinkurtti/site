import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ToggleComponent } from '@components/toggle/toggle.component';
import { DialogBaseDirective } from '@directives/dialog/dialog-base.directive';
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
export class SettingsDialogComponent extends DialogBaseDirective {
    public gameManager = inject(SudokuManager);

    public toggleChange(setting: string, value: boolean): void {
        LocalStorageService.setItem(`${this.gameManager.localStoragePrefix}_${setting}`, value);
    }
}
