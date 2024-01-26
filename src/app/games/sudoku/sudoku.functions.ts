import { SudokuCell } from './sudoku.models';

export const getSquare = (cells: Array<Array<SudokuCell>>, row: number, col: number): Array<SudokuCell> => {
    const squareRowStart = Math.floor(row / 3) * 3;
    const squareRowEnd = squareRowStart + 3;
    const squareColStart = Math.floor(col / 3) * 3;
    const squareColEnd = squareColStart + 3;
    const square = cells.slice(squareRowStart, squareRowEnd).map(squareRow => squareRow.slice(squareColStart, squareColEnd));
    return [...square[0], ...square[1], ...square[2]];
};
