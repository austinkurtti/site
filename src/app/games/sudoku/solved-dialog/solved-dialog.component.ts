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

    // eslint-disable-next-line @typescript-eslint/naming-convention
    public SudokuDifficulty = SudokuDifficulty;

    public timeValue = 'PT';
    public timeDisplay = '';

    public ngOnInit(): void {
        const timeParts = this.time.replace(/0/g, '').split(':');
        if (timeParts[0]) {
            this.timeValue += `${timeParts[0]}H`;
            this.timeDisplay += `${timeParts[0]}h`;
        }
        if (timeParts[1]) {
            this.timeValue += `${timeParts[1]}M`;
            this.timeDisplay += ((this.timeDisplay ? ' ' : '') + `${timeParts[1]}m`);
        }
        if (timeParts[2]) {
            this.timeValue += `${timeParts[2]}S`;
            this.timeDisplay += ((this.timeDisplay ? ' ' : '') + `${timeParts[2]}s`);
        }
    }
}
