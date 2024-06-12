import { Component, Input } from '@angular/core';
import { DialogBaseDirective } from '@directives/dialog/dialog-base';

@Component({
    standalone: true,
    selector: 'ak-failed-dialog',
    styleUrls: ['./failed-dialog.component.scss'],
    templateUrl: './failed-dialog.component.html'
})
export class FailedDialogComponent extends DialogBaseDirective {
    @Input() correctValue: number;
    @Input() incorrectValue: number;
    @Input() goHome: () => void;
    @Input() playAgain: () => void;
}
