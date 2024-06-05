import { BehaviorSubject } from 'rxjs';
import { getSquare } from './sudoku.functions';
import { SudokuCell, SudokuDifficulty, SudokuState, sudokuValueCandidateMap } from './sudoku.models';

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
                cell.revealed = false;
            });
        });
        this._resetNumEmptyCells();
    }

    public checkSolved(): void {
        if (this._numEmptyCells === 0 && this.validateAll()) {
            this.solved$.next(true);
        }
    }

    public getCellSolution(rIndex: number, cIndex: number): number {
        return this._solution[rIndex][cIndex].value;
    }

    public validateCell(rIndex: number, cIndex: number, showValidation = false): boolean {
        const cell = this.cells[rIndex][cIndex];
        const valid = cell.value === this._solution[rIndex][cIndex].value;
        if (showValidation) {
            cell.valid = valid;
        }
        return valid;
    }

    public validateAll(showValidation = false): boolean {
        let allValid = true;
        this.cells.forEach((row, rIndex) => {
            row.forEach((cell, cIndex) => {
                if (!cell.given && !cell.revealed && cell.value !== null) {
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

    public revealCell(rIndex: number, cIndex: number): void {
        const cell = this.cells[rIndex][cIndex];
        if (cell.value === null) {
            this._numEmptyCells--;
        }
        cell.value = this._solution[rIndex][cIndex].value;
        cell.candidates = 0;
        cell.valid = null;
        cell.revealed = true;
    }

    public revealAll(): void {
        this.cells.forEach((row, rIndex) => {
            row.forEach((cell, cIndex) => {
                if (!cell.given) {
                    cell.value = this._solution[rIndex][cIndex].value;
                    cell.candidates = 0;
                    cell.valid = null;
                    cell.revealed = true;
                }
            });
        });
        this._numEmptyCells = 0;
    }

    public clearCandidates(rIndex: number, cIndex: number, value: number) {
        const candidate = sudokuValueCandidateMap.get(value);
        this.cells[rIndex].forEach(cell => cell.candidates = cell.candidates & ~candidate);
        this.cells.forEach(row => row[cIndex].candidates = row[cIndex].candidates & ~candidate);
        getSquare(this.cells, rIndex, cIndex).forEach(cell => cell.candidates = cell.candidates & ~candidate);
    }

    private _resetNumEmptyCells(): void {
        this._numEmptyCells = 0;
        this.cells.forEach(row => row.forEach(cell => this._numEmptyCells += (cell.value === null ? 1 : 0)));
    }
}
