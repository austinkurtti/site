export enum SudokuDifficulty {
    easy = 5,
    medium = 15,
    hard = 30
}

export enum SudokuState {
    paused = 1,
    running = 2
}

export class SudokuCell {
    public given: boolean;
    public valid: boolean;
    public value?: number = null;
}

export class SudokuBoard {
    public state = SudokuState.paused;
    public cells: Array<Array<SudokuCell>> = [];

    public get valid(): boolean {
        for (let i = 0; i < 9; i++) {
            const rowSum = this.cells[i].map(cell => cell.value).reduce((sum, cur) => sum + cur);
            if (rowSum !== 45) {
                return false;
            }

            const colSum = this.cells.map(row => row[i].value).reduce((sum, cur) => sum + cur);
            if (colSum !== 45) {
                return false;
            }

            const squareRowStart = Math.floor(i / 3) * 3;
            const squareRowEnd = squareRowStart + 3;
            const squareColStart = (i % 3) * 3;
            const squareColEnd = squareColStart + 3;
            const square = this.cells.slice(squareRowStart, squareRowEnd).map(squareRow => squareRow.slice(squareColStart, squareColEnd));
            const squareValues = [...square[0], ...square[1], ...square[2]].map(squareCell => squareCell.value);
            const squareSum = squareValues.reduce((sum, cur) => sum + cur);
            if (squareSum !== 45) {
                return false;
            }
        }
        return true;
    }

    public workerBuild(difficulty: SudokuDifficulty): Promise<void> {
        return new Promise<void>(resolve => {
            if (typeof Worker !== 'undefined') {
                const worker = new Worker(new URL('./sudoku.worker.ts', import.meta.url));
                worker.onmessage = ({ data }) => {
                    this.cells = data;
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
}
