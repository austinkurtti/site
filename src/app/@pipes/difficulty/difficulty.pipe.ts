import { Pipe, PipeTransform } from '@angular/core';
import { SudokuDifficulty } from '../../games/sudoku/sudoku.models';

@Pipe({
    name: 'sudokuDifficulty'
})
export class DifficultyPipe implements PipeTransform {
    public transform(difficulty: SudokuDifficulty) {
        return difficulty === SudokuDifficulty.easy
            ? 'Easy'
            : difficulty === SudokuDifficulty.medium
                ? 'Medium'
                : 'Hard';
    }
}
