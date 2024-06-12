import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnInit, inject } from '@angular/core';
import { DialogBaseDirective } from '@directives/dialog/dialog-base';
import { DifficultyPipe } from '@pipes/difficulty.pipe';
import { ConfettiService } from '@services/confetti.service';
import { interval } from 'rxjs';
import { take } from 'rxjs/operators';
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
export class SolvedDialogComponent extends DialogBaseDirective implements OnInit, AfterViewInit {
    public gameManager = inject(SudokuManager);

    public goHome: () => void;
    public playAgain: () => void;

    public timeDisplay = '';

    private _confetti = inject(ConfettiService);
    private _elementRef = inject(ElementRef);

    public ngOnInit(): void {
        this.timeDisplay = this.gameManager.gameInstance.time$.value.trimLeftChars(['0', ':']);
    }

    public ngAfterViewInit(): void {
        // Because who doesn't love confetti?
        const rect = this._elementRef.nativeElement.getBoundingClientRect();
        const bursts: number[][] = [
            [rect.left, rect.top + ((rect.bottom - rect.top) / 2)],
            [rect.right, rect.bottom],
            [rect.left + ((rect.right - rect.left) / 2), rect.top]
        ];

        interval(500).pipe(take(bursts.length)).subscribe(frame => {
            const burst = bursts[frame];
            this._confetti.burst(burst[0], burst[1]);
        });
    }
}
