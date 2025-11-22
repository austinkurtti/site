import { Component, Input } from '@angular/core';
import { DialogDirective } from '@directives/dialog/dialog.directive';

@Component({
    standalone: true,
    selector: 'ak-confirm',
    styleUrls: ['./confirm.component.scss'],
    templateUrl: './confirm.component.html'
})
export class ConfirmDialogComponent extends DialogDirective {
    @Input() title: string;
    @Input() message: string;
    @Input() confirmText: string;
    @Input() cancelText: string;
    @Input() confirm: () => void;
    @Input() cancel: () => void;
}
