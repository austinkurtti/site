import { BehaviorSubject } from 'rxjs';

export enum SudokuDifficulty {
    easy = 1,
    medium = 2,
    hard = 3
}

export class SudokuCell {
    public given: boolean;
    public valid: boolean;
    public value?: number = null;
}

export class SudokuBoard {
    public cells: Array<Array<SudokuCell>> = [];

    public primed$ = new BehaviorSubject<boolean>(false);

    private _possibleValues = [1, 2, 3, 4, 5, 6, 7, 8, 9];

    private get _shuffledValues(): number[] {
        const shuffledVals = [...this._possibleValues];
        for (let i = shuffledVals.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledVals[i], shuffledVals[j]] = [shuffledVals[j], shuffledVals[i]];
        }
        return shuffledVals;
    }

    private get _isFull(): boolean {
        for (const row of this.cells) {
            for (const cell of row) {
                if (cell.value === null) {
                    return false;
                }
            };
        };
        return true;
    }

    public prime(difficulty: SudokuDifficulty): void {
        this.primed$.next(false);
        this.cells = [...new Array(9)].map(() => [...new Array(9)].map(() => new SudokuCell()));

        this._fillBoard();

        this.primed$.next(true);
    }

    private _fillBoard(): boolean {
        let row: number;
        let col: number;
        for (let i = 0; i < 81; i++) {
            row = Math.floor(i / 9);
            col = i % 9;
            if (this.cells[row][col].value === null) {
                const shuffledValues = this._shuffledValues;
                for (const value of shuffledValues) {
                    if (this._rowValid(row, value)) {
                        if (this._colValid(col, value)) {
                            if (this._squareValid(row, col, value)) {
                                this.cells[row][col].value = value;
                                if (this._isFull) {
                                    return true;
                                } else if (this._fillBoard()) {
                                    return true;
                                }
                            }
                        }
                    }
                }
                break;
            }
        }
        this.cells[row][col].value = null;
    }

    private _rowValid(row: number, value?: number): boolean {
        const rowValues = this.cells[row].map(cell => cell.value);
        return !rowValues.includes(value);
    }

    private _colValid(col: number, value?: number): boolean {
        const colValues = this.cells.map(row => row[col].value);
        return !colValues.includes(value);
    }

    private _squareValid(row: number, col: number, value?: number): boolean {
        const squareRowStart = Math.floor(row / 3) * 3;
        const squareRowEnd = squareRowStart + 3;
        const squareColStart = Math.floor(col / 3) * 3;
        const squareColEnd = squareColStart + 3;
        const square = this.cells.slice(squareRowStart, squareRowEnd).map(squareRow => squareRow.slice(squareColStart, squareColEnd));
        const squareValues = [...square[0], ...square[1], ...square[2]].map(squareCell => squareCell.value);
        return !squareValues.includes(value);
    }
}
