import { Component, ElementRef, OnInit } from '@angular/core';
import { IDialog } from '@interfaces/dialog.interface';
import { SudokuDifficulty } from '../sudoku.models';

@Component({
    standalone: true,
    selector: 'ak-solved-dialog',
    styleUrls: ['./solved-dialog.component.scss'],
    templateUrl: './solved-dialog.component.html'
})
export class SolvedDialogComponent implements IDialog, OnInit {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    public SudokuDifficulty = SudokuDifficulty;

    public difficulty: SudokuDifficulty;
    public time: string;
    public timeValue = 'PT';

    constructor(
        public elementRef: ElementRef
    ) {}

    public ngOnInit(): void {
        const timeParts = this.time.replace(/0/g, '').split(':');
        this.timeValue += timeParts[0] ? `${timeParts[0]}H` : '';
        this.timeValue += timeParts[1] ? `${timeParts[1]}M` : '';
        this.timeValue += timeParts[2] ? `${timeParts[2]}S` : '';
    }
}
