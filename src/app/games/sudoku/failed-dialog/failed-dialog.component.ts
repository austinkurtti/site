import { Component, Input } from '@angular/core';
import { DialogDirective } from '@directives/dialog/dialog.directive';

@Component({
    standalone: true,
    selector: 'ak-failed-dialog',
    styleUrls: ['./failed-dialog.component.scss'],
    templateUrl: './failed-dialog.component.html'
})
export class FailedDialogComponent extends DialogDirective {
    @Input() correctValue: number;
    @Input() incorrectValue: number;
    @Input() playDifferentGame: () => void;
    @Input() playAgain: () => void;
}
