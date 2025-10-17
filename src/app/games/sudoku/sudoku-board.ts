import { BehaviorSubject } from 'rxjs';
import { getSquare } from './sudoku.functions';
import { SudokuCell, SudokuGameInstance, SudokuGameState, sudokuValueCandidateMap } from './sudoku.models';

// TODO - make this an injectable and implement WorkerService
export class SudokuBoard {
    public state = SudokuGameState.paused;
    public cells: Array<Array<SudokuCell>> = [];

    public solved$ = new BehaviorSubject<boolean>(false);

    private _worker: Worker;
    private _numEmptyCells: number;
    private _units: Array<Array<{ r: number, c: number }>> = [];
    private _solution: Array<Array<SudokuCell>> = [];

    public get numEmptyCells(): number {
        return this._numEmptyCells;
    }
    public set numEmptyCells(value: number) {
        this._numEmptyCells = value;
        this.checkSolved();
    }

    constructor() {
        this._initUnits();
    }

    public cleanup(): void {
        this._worker?.removeAllListeners();
        this._worker?.terminate();
    }

    public build(gameInstance: SudokuGameInstance): Promise<void> {
        this.cleanup();
        this.solved$.next(false);
        return new Promise<void>(resolve => {
            if (window.isSecureContext && typeof Worker !== 'undefined') {
                this._worker = new Worker(new URL('./sudoku.worker.ts', import.meta.url), { type: 'module' });
                this._worker.onmessage = ({ data }) => {
                    this._solution = data.solution;
                    this.cells = gameInstance.cells.length ? gameInstance.cells : data.cells;
                    this._resetNumEmptyCells();
                    resolve();
                };
                this._worker.postMessage({ difficulty: gameInstance.difficulty, seed: gameInstance.seed });
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

    // *This could be improved by using Naked Pairs/Triples/etc and Hidden Pairs/Triples/etc to reduce candidates
    public findHintCell(): { row: number, col: number } | null {
        // First, hint about any wrong entries
        // It would be unfair to lead the player on with a false hint if the candidate map is wrong
        for (let rIndex = 0; rIndex < this.cells.length; rIndex++) {
            const row = this.cells[rIndex];
            for (let cIndex = 0; cIndex < this.cells[rIndex].length; cIndex++) {
                if (row[cIndex].value !== null && !this.validateCell(rIndex, cIndex)) {
                    return { row: rIndex, col: cIndex };
                }
            }
        }

        // Get updated candidate map
        const candidateMap = Array.from({ length: 9 }, (_, r) => Array.from({ length: 9 }, (_, c) => this._getCandidates(r, c)));

        // Find Hidden Singles
        for (const unit of this._units) {
            for (let candidate = 1; candidate <= 9; candidate++) {
                let count = 0;
                let lastCell: { row: number, col: number } | null = null;
                unit.forEach(({ r, c }) => {
                    if (candidateMap[r][c].includes(candidate)) {
                        count++;
                        lastCell = { row: r, col: c };
                    }
                });
                if (count === 1 && lastCell) {
                    return { row: lastCell.row, col: lastCell.col };
                }
            }
        }

        // If no other hints are possible, just return the cell with the fewest candidates
        let bestCell: { row: number, col: number, candidates: number[] } | null = null;
        for (let rIndex = 0; rIndex < 9; rIndex++) {
            for (let cIndex = 0; cIndex < 9; cIndex++) {
                const candidates = candidateMap[rIndex][cIndex];
                if (candidates.length === 0) {
                    continue;
                }
                if (!bestCell || candidates.length < bestCell.candidates.length) {
                    bestCell = { row: rIndex, col: cIndex, candidates };
                }
            }
        }
        return bestCell ? { row: bestCell.row, col: bestCell.col } : null;
    }

    private _resetNumEmptyCells(): void {
        this._numEmptyCells = 0;
        this.cells.forEach(row => row.forEach(cell => this._numEmptyCells += (cell.value === null ? 1 : 0)));
    }

    private _initUnits(): void {
        // Rows
        this._units = this._units.concat(Array.from({ length: 9 }, (_, r) => Array.from({ length: 9 }, (_, c) => ({ r, c }))));
        // Columns
        this._units = this._units.concat(Array.from({ length: 9 }, (_, c) => Array.from({ length: 9 }, (_, r) => ({ r, c }))));
        // Squares
        for (let br = 0; br < 3; br++) {
            for (let bc = 0; bc < 3; bc++) {
                const square = [];
                for (let r = br * 3; r < br * 3 + 3; r++) {
                    for (let c = bc * 3; c < bc * 3 + 3; c++) {
                        square.push({ r, c });
                    }
                }
                this._units.push(square);
            }
        }
    }

    private _getCandidates = (rIndex: number, cIndex: number): number[] => {
        // Don't find candidates for occupied cells
        if (this.cells[rIndex][cIndex].value !== null || this.cells[rIndex][cIndex].given) {
            return [];
        }

        // Find all used numbers in entire row, column, and square
        const used = new Set<number>();
        this.cells[rIndex].forEach(cell => {
            if (cell.value) {
                used.add(cell.value);
            }
        });
        this.cells.forEach(row => {
            if (row[cIndex].value) {
                used.add(row[cIndex].value);
            }
        });
        getSquare(this.cells, rIndex, cIndex).forEach(cell => {
            if (cell.value) {
                used.add(cell.value);
            }
        });

        // Remove used numbers as candidates
        const candidates = [];
        for (let v = 1; v <= 9; v++) {
            if (!used.has(v)) {
                candidates.push(v);
            }
        }

        return candidates;
    };
}
