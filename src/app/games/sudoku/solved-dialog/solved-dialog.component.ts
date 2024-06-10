import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { DialogBase } from '@directives/dialog/dialog-base';
import { DifficultyPipe } from '@pipes/difficulty.pipe';
import { SudokuManager } from '../sudoku-manager';

@Component({
    standalone: true,
    imports: [
        CommonModule,
        DifficultyPipe
    ],
    selector: 'ak-solved-dialog',
    styleUrls: ['./solved-dialog.component.scss'],
    templateUrl: './solved-dialog.component.html'
})
export class SolvedDialogComponent extends DialogBase implements OnInit {
    public gameManager = inject(SudokuManager);

    public goHome: () => void;
    public playAgain: () => void;

    public timeDisplay = '';

    public ngOnInit(): void {
        this.timeDisplay = this.gameManager.gameInstance.time$.value.trimLeftChars(['0', ':']);
    }
}
