import { Injectable } from '@angular/core';
import { LocalStorageService } from '@services/local-storage.service';
import { SudokuCell, SudokuGameInstance, SudokuGameSettings, SudokuScreenState } from './sudoku.models';

@Injectable({
    providedIn: 'root'
})
export class SudokuManager {
    public readonly localStoragePrefix = 'sudoku';

    public screen = SudokuScreenState.menu;
    public gameSettings = new SudokuGameSettings();
    public gameInstance: SudokuGameInstance;
    public savedGame: SudokuGameInstance = null;

    public initialize(): void {
        this.gameSettings.showTimer = LocalStorageService.getItem(`${this.localStoragePrefix}_showTimer`) ?? true;
        this.gameSettings.erasePencil = LocalStorageService.getItem(`${this.localStoragePrefix}_erasePencil`) ?? false;
        this.gameSettings.showConflicts = LocalStorageService.getItem(`${this.localStoragePrefix}_showConflicts`) ?? false;
        this.gameSettings.disableInputs = LocalStorageService.getItem(`${this.localStoragePrefix}_disableInputs`) ?? true;
        this.gameSettings.exitSave = LocalStorageService.getItem(`${this.localStoragePrefix}_exitSave`) ?? true;

        const saveData = LocalStorageService.getItem(`${this.localStoragePrefix}_savedGame`);
        if (saveData) {
            this._syncSavedGame(JSON.parse(saveData));
        }
    }

    public saveGame(cells: Array<Array<SudokuCell>>): void {
        const saveData = {
            cells,
            difficulty: this.gameInstance.difficulty,
            hardcore: this.gameInstance.hardcore,
            seed: this.gameInstance.seed,
            time$: this.gameInstance.time$.value
        };
        LocalStorageService.setItem(`${this.localStoragePrefix}_savedGame`, JSON.stringify(saveData));
        this._syncSavedGame(saveData);
    }

    public deleteSave(): void {
        LocalStorageService.removeItem(`${this.localStoragePrefix}_savedGame`);
        this.savedGame = null;
    }

    private _syncSavedGame(saveData: any): void {
        this.savedGame = new SudokuGameInstance(saveData);
    }
}
