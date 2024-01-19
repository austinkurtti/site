import { Component, Input } from '@angular/core';
import { DialogBase } from '@directives/dialog/dialog-base';
import { DifficultyPipeModule } from '@pipes/difficulty/difficulty.module';
import { SudokuDifficulty } from '../sudoku.models';

@Component({
    standalone: true,
    imports: [
        DifficultyPipeModule
    ],
    selector: 'ak-solved-dialog',
    styleUrls: ['./solved-dialog.component.scss'],
    templateUrl: './solved-dialog.component.html'
})
export class SolvedDialogComponent extends DialogBase {
    @Input() difficulty: SudokuDifficulty;
    @Input() time: string;
    @Input() goHome: () => void;
    @Input() playAgain: () => void;
}
