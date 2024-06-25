import { BehaviorSubject } from 'rxjs';

export enum SudokuScreenState {
    menu = 1,
    game = 2
}

export enum SudokuGameState {
    paused = 1,
    running = 2,
    solved = 3,
    failed = 4
}

export enum SudokuDifficulty {
    easy = 1,
    medium = 5,
    hard = 20
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

export const sudokuValueCandidateMap = new Map<number, SudokuCandidate>([
    [1, SudokuCandidate.one],
    [2, SudokuCandidate.two],
    [3, SudokuCandidate.three],
    [4, SudokuCandidate.four],
    [5, SudokuCandidate.five],
    [6, SudokuCandidate.six],
    [7, SudokuCandidate.seven],
    [8, SudokuCandidate.eight],
    [9, SudokuCandidate.nine]
]);

export class SudokuGameSettings {
    // General
    public showTimer = true;

    // Assistive
    public showConflicts = false;
    public erasePencil = false;
    public disableInputs = true;
    public extraHighlights = false;

    // Game Saves
    public exitSave = true;
}

export class SudokuGameInstance {
    public cells: Array<Array<SudokuCell>> = [];
    public difficulty: SudokuDifficulty;
    public hardcore = false;
    public seed: string;
    public time$ = new BehaviorSubject<string>('00:00:00');

    constructor(partial?: Partial<SudokuGameInstance>) {
        if (partial) {
            Object.assign(this, partial);
        }
        if (typeof partial.time$ === 'string') {
            this.time$ = new BehaviorSubject<string>('');
            this.time$.next(partial.time$);
        }
    }
}

export class SudokuCell {
    // If true, this cell was already revealed at the beginning of the game
    public given: boolean;

    // Denotes the currently active, focused cell
    public active: boolean;

    // If true, this cell was revealed during the game by the player, highlight it blue
    public revealed: boolean;

    // true = right number, hightlight it green; false = wrong number, highlight it red; null = validity not shown
    public valid?: boolean = null;

    // Not necessarily right or wrong, just means there are one or more cells with the same value in this cell's row/column/square
    public numConflicts = 0;

    // Number value of the cell; null = not set
    public value?: number = null;

    // Flag-based value of any "penciled in" numbers
    public candidates = 0;
}
