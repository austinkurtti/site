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
        this.checkSolved();
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
                    this._resetNumEmptyCells();
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
            row.filter(cell => !cell.given).forEach(cell => {
                cell.value = null;
                cell.candidates = 0;
                cell.valid = null;
            });
        });
        this._resetNumEmptyCells();
    }

    public checkSolved(): void {
        if (this._numEmptyCells === 0 && this.validateAll()) {
            this.solved$.next(true);
        }
    }

    public validateAll(showValidation = false): boolean {
        let allValid = true;
        this.cells.forEach((row, rIndex) => {
            row.forEach((cell, cIndex) => {
                if (!cell.given && cell.value !== null) {
                    const valid = cell.value === this._solution[rIndex][cIndex].value;
                    if (showValidation) {
                        cell.valid = valid;
                    }
                    allValid &&= valid;
                }
            });
        });
        return allValid;
    }

    public validateCell(rIndex: number, cIndex: number, showValidation = false): boolean {
        const cell = this.cells[rIndex][cIndex];
        const valid = cell.value === this._solution[rIndex][cIndex].value;
        if (showValidation) {
            cell.valid = valid;
        }
        return valid;
    }

    private _resetNumEmptyCells(): void {
        this._numEmptyCells = 0;
        this.cells.forEach(row => row.forEach(cell => this._numEmptyCells += (cell.value === null ? 1 : 0)));
    }
}
