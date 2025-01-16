import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SudokuManager } from './sudoku-manager';
import { SudokuDifficulty, SudokuGameInstance, SudokuScreenState } from './sudoku.models';

@Component({
    selector: 'ak-sudoku',
    styleUrls: ['./sudoku.component.scss'],
    templateUrl: './sudoku.component.html',
    standalone: false
})
export class SudokuComponent implements OnInit, OnDestroy {
    public gameManager = inject(SudokuManager);

    // eslint-disable-next-line @typescript-eslint/naming-convention
    public ScreenState = SudokuScreenState;

    private _activatedRoute = inject(ActivatedRoute);

    public ngOnInit(): void {
        this.gameManager.initialize();

        // Check for a valid linked game
        const difficulty = +this._activatedRoute.snapshot.queryParams['d'];
        const hardcore = this._activatedRoute.snapshot.queryParams['h'];
        const seed = this._activatedRoute.snapshot.queryParams['s'];
        if (Object.values(SudokuDifficulty).includes(difficulty) && (hardcore === 'true' || hardcore === 'false') && seed) {
            const linkedGame = new SudokuGameInstance({
                difficulty: difficulty as SudokuDifficulty,
                hardcore: hardcore === 'true',
                seed
            });
            this.gameManager.gameInstance = linkedGame;
            this.gameManager.screen = SudokuScreenState.game;
        }
    }

    public ngOnDestroy(): void {
        // Reset screen state in case player comes back later
        this.gameManager.screen = SudokuScreenState.menu;
    }
}
