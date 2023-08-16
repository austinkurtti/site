import { SudokuCell, SudokuDifficulty, SudokuState } from './sudoku.models';

export class SudokuBoard {
    public state = SudokuState.paused;
    public cells: Array<Array<SudokuCell>> = [];

    private _solution: Array<Array<SudokuCell>> = [];

    public build(difficulty: SudokuDifficulty): Promise<void> {
        return new Promise<void>(resolve => {
            if (typeof Worker !== 'undefined') {
                const worker = new Worker(new URL('./sudoku.worker.ts', import.meta.url));
                worker.onmessage = ({ data }) => {
                    this._solution = data.solution;
                    this.cells = data.cells;
                    resolve();
                };
                worker.postMessage(difficulty);
            } else {
                // TODO: web workers unavailable, do something
            }
        });
    }

    public reset(): void {
        this.cells.forEach(row => {
            row.filter(cell => !cell.given).forEach(cell => cell.value = null);
        });
    }

    public validate(): void {
        this.cells.forEach((row, rIndex) => {
            row.forEach((cell, cIndex) => {
                if (!cell.given) {
                    cell.valid = cell.value === this._solution[rIndex][cIndex].value;
                }
            });
        });
    }
}
