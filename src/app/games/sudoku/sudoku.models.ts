export class SudokuCell {
    given: boolean;
    valid: boolean;
    value: number;
}

export class SudokuSquare {
    cells: Array<SudokuCell>;

    constructor() {
        this.cells = [...new Array(9)].map(() => new SudokuCell());
    }
}

export class SudokuBoard {
    squares: Array<SudokuSquare>;

    constructor() {
        this.squares = [...new Array(9)].map(() => new SudokuSquare());
    }
}
