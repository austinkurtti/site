import { Component, Input, OnInit } from '@angular/core';
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
export class SolvedDialogComponent extends DialogBase implements OnInit {
    @Input() difficulty: SudokuDifficulty;
    @Input() time: string;
    @Input() goHome: () => void;
    @Input() playAgain: () => void;

    public timeDisplay = '';

    public ngOnInit(): void {
        this.timeDisplay = this.time.trimLeftChars(['0', ':']);
    }
}
