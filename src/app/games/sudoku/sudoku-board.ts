import { BehaviorSubject } from 'rxjs';
import { SudokuCell, SudokuDifficulty, SudokuState } from './sudoku.models';

export class SudokuBoard {
    public state = SudokuState.paused;
    public cells: Array<Array<SudokuCell>> = [];

    public solved$ = new BehaviorSubject<boolean>(false);

    private _worker: Worker;
    private _solution: Array<Array<SudokuCell>> = [];
    private _numEmptyCells: number;

    public get numEmptyCells(): number {
        return this._numEmptyCells;
    }
    public set numEmptyCells(value: number) {
        this._numEmptyCells = value;
        // TODO - add option to not auto-validate
        if (this._numEmptyCells === 0 && this.validate()) {
            this.solved$.next(true);
        }
    }

    public cleanup(): void {
        this._worker?.terminate();
    }

    public build(difficulty: SudokuDifficulty): Promise<void> {
        this.cleanup();
        this.solved$.next(false);
        return new Promise<void>(resolve => {
            if (typeof Worker !== 'undefined') {
                this._worker = new Worker(new URL('./sudoku.worker.ts', import.meta.url));
                this._worker.onmessage = ({ data }) => {
                    this._solution = data.solution;
                    this.cells = data.cells;
                    this._numEmptyCells = 0;
                    this.cells.forEach(row => row.forEach(cell => this._numEmptyCells += (cell.value === null ? 1 : 0)));
                    resolve();
                };
                this._worker.postMessage(difficulty);
            } else {
                // TODO - web workers unavailable, do something
            }
        });
    }

    public reset(): void {
        this.cells.forEach(row => {
            row.filter(cell => !cell.given).forEach(cell => cell.value = null);
        });
    }

    public validate(): boolean {
        let allValid = true;
        this.cells.forEach((row, rIndex) => {
            row.forEach((cell, cIndex) => {
                if (!cell.given) {
                    cell.valid = cell.value === this._solution[rIndex][cIndex].value;
                    allValid &&= cell.valid;
                }
            });
        });
        return allValid;
    }
}
