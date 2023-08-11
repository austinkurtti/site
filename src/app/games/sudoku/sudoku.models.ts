export enum SudokuDifficulty {
    easy = 1,
    medium = 10,
    hard = 30
}

export enum SudokuState {
    paused = 1,
    running = 2
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
    public given: boolean;
    public valid: boolean;
    public value?: number = null;
    public candidates = 0;
}
