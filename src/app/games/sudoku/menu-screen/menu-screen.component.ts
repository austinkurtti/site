import { Component, inject } from '@angular/core';
import { DialogSize } from '@models/dialog.model';
import { DialogService } from '@services/dialog.service';
import { SettingsDialogComponent } from '../settings-dialog/settings-dialog.component';
import { SudokuManager } from '../sudoku-manager';
import { SudokuDifficulty, SudokuGameInstance, SudokuScreenState } from '../sudoku.models';
import { SudokuMenuState } from './menu-screen.models';

@Component({
    selector: 'ak-sudoku-menu-screen',
    styleUrls: ['./menu-screen.component.scss'],
    templateUrl: './menu-screen.component.html',
    standalone: false
})
export class SudokuMenuScreenComponent {
    public gameManager = inject(SudokuManager);

    public menuState = SudokuMenuState.main;
    public difficulty = SudokuDifficulty.easy;
    public hardcore = false;
    public seed = '';
    public time = '';

    // eslint-disable-next-line @typescript-eslint/naming-convention
    public Difficulty = SudokuDifficulty;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    public MenuState = SudokuMenuState;

    private _dialogService = inject(DialogService);

    public resume(): void {
        this.gameManager.gameInstance = this.gameManager.savedGame;
        this.gameManager.screen = SudokuScreenState.game;
    }

    public showSettingsDialog(): void {
        this._dialogService.show(SettingsDialogComponent, DialogSize.small);
    }

    public randomizeSeed(): void {
        this.seed = Math.random().toString().slice(2).slice(0, 16);
    }

    public startNew(): void {
        if (!this.seed) {
            this.randomizeSeed();
        }

        const newInstance = new SudokuGameInstance({
            difficulty: this.difficulty,
            hardcore: this.hardcore,
            seed: this.seed
        });
        this.gameManager.gameInstance = newInstance;
        this.gameManager.screen = SudokuScreenState.game;
    }

    public cancel(): void {
        this._resetValues();
        this.menuState = SudokuMenuState.main;
    }

    private _resetValues(): void {
        this.difficulty = SudokuDifficulty.easy;
        this.hardcore = false;
        this.seed = '';
        this.time = '';
    }
}
