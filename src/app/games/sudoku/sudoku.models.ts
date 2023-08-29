export enum SudokuDifficulty {
    easy = 1,
    medium = 10,
    hard = 30
}

export enum SudokuState {
    paused = 1,
    running = 2,
    solved = 3
}

export enum SudokuCandidate {
    one     = 1 << 0,
    two     = 1 << 1,
    three   = 1 << 2,
    four    = 1 << 3,
    five    = 1 << 4,
    six     = 1 << 5,
    seven   = 1 << 6,
    eight   = 1 << 7,
    nine    = 1 << 8
}

export class SudokuCell {
    // If true, this cell was already revealed at the beginning of the game
    public given: boolean;

    // Denotes the currently active, focused cell
    public active: boolean;

    // true = right number, hightlight it green; false = wrong number, highlight it red; null = validity not shown
    public valid?: boolean = null;

    // Not necessarily right or wrong, just means there is another cell with the same value in this cell's row/column/square
    public conflict: boolean;

    // Number value of the cell; null = not set
    public value?: number = null;

    // Flag-based value of any "penciled in" numbers
    public candidates = 0;
}
