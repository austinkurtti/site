/// <reference lib="webworker" />

import { SudokuCell, SudokuDifficulty } from './sudoku.models';

const possibleValues = [1, 2, 3, 4, 5, 6, 7, 8, 9];
let possibleSolutions = 0;
let cells: SudokuCell[][] = [];

addEventListener('message', ({ data }) => {
    // First build a new valid solution
    cells = [...new Array(9)].map(() => [...new Array(9)].map(() => new SudokuCell()));
    fillBoard();

    // Save solution for easy comparison later
    const solution = [...new Array(9)].map(() => [...new Array(9)].map(() => new SudokuCell()));
    solution.forEach((row, rIndex) => {
        row.forEach((cell, cIndex) => cell.value = cells[rIndex][cIndex].value);
    });

    // Remove values according to given difficulty
    makePuzzle(data);

    postMessage({ solution, cells });
});

const fillBoard = (): boolean => {
    // Find the next blank cell
    let row: number;
    let col: number;
    for (let i = 0; i < 81; i++) {
        row = Math.floor(i / 9);
        col = i % 9;
        if (cells[row][col].value === null) {
            // Shuffle the possible values to keep randomizing the solution generation
            const shuffledValues = shuffleValues();
            for (const value of shuffledValues) {
                // Make sure the row, column and square are all valid
                if (rowValid(cells, row, value)) {
                    if (colValid(cells, col, value)) {
                        if (squareValid(cells, row, col, value)) {
                            // Mark this cell with the candidate value
                            cells[row][col].value = value;
                            if (isFull(cells)) {
                                // The board is complete
                                return true;
                            } else if (fillBoard()) {
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
};

const makePuzzle = (difficulty: SudokuDifficulty): SudokuCell[][] => {
    let emptyCells: number;
    const allowedEmptyCells = getAllowedEmptyCells(difficulty);
    const original = [...new Array(9)].map(() => [...new Array(9)].map(() => new SudokuCell()));
    cells.forEach((row, rIndex) => {
        row.forEach((cell, cIndex) => {
            original[rIndex][cIndex].value = cell.value;
        });
    });

    do {
        // Restore cells to original filled grid
        let attempts = difficulty as number;
        emptyCells = 0;
        original.forEach((oRow, rIndex) => {
            oRow.forEach((oCell, cIndex) => {
                cells[rIndex][cIndex].value = oCell.value;
            });
        });

        // Attempt to create a valid puzzle
        while (attempts > 0) {
            // Pick a random cell to blank out
            let row = Math.floor(Math.random() * 9);
            let col = Math.floor(Math.random() * 9);
            while (cells[row][col].value === null) {
                row = Math.floor(Math.random() * 9);
                col = Math.floor(Math.random() * 9);
            }

            // Remember the cell value in case it needs to be restored
            const originalValue = cells[row][col].value;
            cells[row][col].value = null;

            // Copy the board so the solver can modify it to find solutions wihtout affecting the master
            const copy = [...new Array(9)].map(() => [...new Array(9)].map(() => new SudokuCell()));
            copy.forEach((copyRow, rowIndex) => {
                copyRow.forEach((copyCell, cellIndex) => {
                    copyCell.value = cells[rowIndex][cellIndex].value;
                });
            });

            // Reset solution counter and find how many solutions now exist
            possibleSolutions = 0;
            solveBoard(copy);

            if (possibleSolutions !== 1) {
                // Cancel the change to the board because there is an invalid number of solutions
                cells[row][col].value = originalValue;
                attempts--;
            }
        }

        // Make sure the candidate puzzle falls within acceptable difficulty bounds
        cells.forEach(row => {
            row.forEach(cell => {
                emptyCells += cell.value === null ? 1 : 0;
            });
        });
    } while (emptyCells < allowedEmptyCells[0] || emptyCells > allowedEmptyCells[1]);

    cells.forEach(row => {
        row.forEach(cell => {
            cell.given = cell.value !== null;
        });
    });

    return cells;
};

const solveBoard = (candidateCells: Array<Array<SudokuCell>>): boolean => {
    // Find the next blank cell
    let row: number;
    let col: number;
    for (let i = 0; i < 81; i++) {
        row = Math.floor(i / 9);
        col = i % 9;
        if (candidateCells[row][col].value === null) {
            // Find the next value that doesn't break the solution, if any
            for (const value of possibleValues) {
                if (rowValid(candidateCells, row, value)) {
                    if (colValid(candidateCells, col, value)) {
                        if (squareValid(candidateCells, row, col, value)) {
                            candidateCells[row][col].value = value;
                            if (isFull(candidateCells)) {
                                // This is a possible solution, but there could be more
                                possibleSolutions++;
                                break;
                            } else if (solveBoard(candidateCells)) {
                                return true;
                            }
                        }
                    }
                }
            }
            break;
        }
    }
    candidateCells[row][col].value = null;
};

const shuffleValues = (): number[] => {
    const shuffledVals = [...possibleValues];
    for (let i = shuffledVals.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledVals[i], shuffledVals[j]] = [shuffledVals[j], shuffledVals[i]];
    }
    return shuffledVals;
};

const isFull = (candidateCells: Array<Array<SudokuCell>>): boolean => {
    for (const row of candidateCells) {
        for (const cell of row) {
            if (cell.value === null) {
                return false;
            }
        };
    };
    return true;
};

const rowValid = (candidateCells: Array<Array<SudokuCell>>, row: number, value?: number): boolean => {
    const rowValues = candidateCells[row].map(cell => cell.value);
    return !rowValues.includes(value);
};

const colValid = (candidateCells: Array<Array<SudokuCell>>, col: number, value?: number): boolean => {
    const colValues = candidateCells.map(row => row[col].value);
    return !colValues.includes(value);
};

const squareValid = (candidateCells: Array<Array<SudokuCell>>, row: number, col: number, value?: number): boolean => {
    const squareRowStart = Math.floor(row / 3) * 3;
    const squareRowEnd = squareRowStart + 3;
    const squareColStart = Math.floor(col / 3) * 3;
    const squareColEnd = squareColStart + 3;
    const square = candidateCells.slice(squareRowStart, squareRowEnd).map(squareRow => squareRow.slice(squareColStart, squareColEnd));
    const squareValues = [...square[0], ...square[1], ...square[2]].map(squareCell => squareCell.value);
    return !squareValues.includes(value);
};

const getAllowedEmptyCells = (difficulty: SudokuDifficulty): Array<number> =>
    difficulty === SudokuDifficulty.easy
        ? [25, 35]
        : difficulty === SudokuDifficulty.medium
            ? [40, 50]
            : [55, 65];
