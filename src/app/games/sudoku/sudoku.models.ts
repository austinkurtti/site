
export enum SudokuDifficulty {
    easy = 1,
    medium = 5,
    hard = 15
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

    private _possibleValues = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    private _possibleSolutions = 0;

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

    private get _shuffledValues(): number[] {
        const shuffledVals = [...this._possibleValues];
        for (let i = shuffledVals.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledVals[i], shuffledVals[j]] = [shuffledVals[j], shuffledVals[i]];
        }
        return shuffledVals;
    }

    public async build(difficulty: SudokuDifficulty): Promise<void> {
        this.cells = [...new Array(9)].map(() => [...new Array(9)].map(() => new SudokuCell()));

        // First build a new valid solution
        this._fillBoard();

        // Remove enough values according to the desired difficulty
        await this._makePuzzle(difficulty);
    }

    public reset(): void {
        this.cells.forEach(row => {
            row.filter(cell => !cell.given).forEach(cell => cell.value = null);
        });
    }

    private _fillBoard(): boolean {
        // Find the next blank cell
        let row: number;
        let col: number;
        for (let i = 0; i < 81; i++) {
            row = Math.floor(i / 9);
            col = i % 9;
            if (this.cells[row][col].value === null) {
                // Shuffle the possible values to keep randomizing the solution generation
                const shuffledValues = this._shuffledValues;
                for (const value of shuffledValues) {
                    // Make sure the row, column and square are all valid
                    if (this._rowValid(this.cells, row, value)) {
                        if (this._colValid(this.cells, col, value)) {
                            if (this._squareValid(this.cells, row, col, value)) {
                                // Mark this cell with the candidate value
                                this.cells[row][col].value = value;
                                if (this._isFull(this.cells)) {
                                    // The board is complete
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

    private _makePuzzle(difficulty: SudokuDifficulty): Promise<void> {
        return new Promise<void>(resolve => {
            let attempts = difficulty as number; // make this related to difficulty

            while (attempts > 0) {
                // Pick a random cell to blank out
                let row = Math.floor(Math.random() * 9);
                let col = Math.floor(Math.random() * 9);
                while (this.cells[row][col].value === null) {
                    row = Math.floor(Math.random() * 9);
                    col = Math.floor(Math.random() * 9);
                }

                // Remember the cell value in case in needs to be restored
                const originalValue = this.cells[row][col].value;
                this.cells[row][col].value = null;

                // Copy the board so the solver can modify it to find solutions wihtout affecting the master
                const copy = [...new Array(9)].map(() => [...new Array(9)].map(() => new SudokuCell()));
                copy.forEach((copyRow, rowIndex) => {
                    copyRow.forEach((copyCell, cellIndex) => {
                        copyCell.value = this.cells[rowIndex][cellIndex].value;
                    });
                });

                // Reset solution counter and find how many solutions now exist
                this._possibleSolutions = 0;
                this._solveBoard(copy);

                if (this._possibleSolutions !== 1) {
                    // Cancel the change to the board because there is an invalid number of solutions
                    this.cells[row][col].value = originalValue;
                    attempts--;
                }
            }

            this.cells.forEach(row => {
                row.forEach(cell => {
                    cell.given = cell.value !== null;
                });
            });

            resolve();
        });
    }

    private _solveBoard(cells: Array<Array<SudokuCell>>): boolean {
        // Find the next blank cell
        let row: number;
        let col: number;
        for (let i = 0; i < 81; i++) {
            row = Math.floor(i / 9);
            col = i % 9;
            if (cells[row][col].value === null) {
                // Find the next value that doesn't break the solution, if any
                for (const value of this._possibleValues) {
                    if (this._rowValid(cells, row, value)) {
                        if (this._colValid(cells, col, value)) {
                            if (this._squareValid(cells, row, col, value)) {
                                cells[row][col].value = value;
                                if (this._isFull(cells)) {
                                    // This is a possible solution, but there could be more
                                    this._possibleSolutions++;
                                    break;
                                } else if (this._solveBoard(cells)) {
                                    return true;
                                }
                            }
                        }
                    }
                }
                break;
            }
        }
        cells[row][col].value = null;
    }

    private _isFull(cells: Array<Array<SudokuCell>>): boolean {
        for (const row of cells) {
            for (const cell of row) {
                if (cell.value === null) {
                    return false;
                }
            };
        };
        return true;
    }

    private _rowValid(cells: Array<Array<SudokuCell>>, row: number, value?: number): boolean {
        const rowValues = cells[row].map(cell => cell.value);
        return !rowValues.includes(value);
    }

    private _colValid(cells: Array<Array<SudokuCell>>, col: number, value?: number): boolean {
        const colValues = cells.map(row => row[col].value);
        return !colValues.includes(value);
    }

    private _squareValid(cells: Array<Array<SudokuCell>>, row: number, col: number, value?: number): boolean {
        const squareRowStart = Math.floor(row / 3) * 3;
        const squareRowEnd = squareRowStart + 3;
        const squareColStart = Math.floor(col / 3) * 3;
        const squareColEnd = squareColStart + 3;
        const square = cells.slice(squareRowStart, squareRowEnd).map(squareRow => squareRow.slice(squareColStart, squareColEnd));
        const squareValues = [...square[0], ...square[1], ...square[2]].map(squareCell => squareCell.value);
        return !squareValues.includes(value);
    }
}
