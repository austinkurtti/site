import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit, inject } from '@angular/core';
import { DialogDirective } from '@directives/dialog/dialog.directive';
import { DifficultyPipe } from '@pipes/difficulty.pipe';
import { EffectsService } from '@services/effects.service';
import { SudokuManager } from '../sudoku-manager';

@Component({
    selector: 'ak-solved-dialog',
    styleUrl: './solved-dialog.component.scss',
    templateUrl: './solved-dialog.component.html',
    imports: [
        CommonModule,
        DifficultyPipe
    ],
})
export class SolvedDialogComponent extends DialogDirective implements OnInit, AfterViewInit {
    public gameManager = inject(SudokuManager);

    public playDifferentGame: () => void;
    public playAgain: () => void;

    public timeDisplay = '';

    private _effectsService = inject(EffectsService);

    public ngOnInit(): void {
        this.timeDisplay = this.gameManager.gameInstance.time$.value.trimLeftChars(['0', ':']);
    }

    public override ngAfterViewInit(): void {
        super.ngAfterViewInit();
        this._effectsService.fireworks();
    }
}
