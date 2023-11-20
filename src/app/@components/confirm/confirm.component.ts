import { Component, Input } from '@angular/core';
import { DialogBase } from '@directives/dialog/dialog-base';

@Component({
    standalone: true,
    selector: 'ak-confirm',
    styleUrls: ['./confirm.component.scss'],
    templateUrl: './confirm.component.html'
})
export class ConfirmDialogComponent extends DialogBase {
    @Input() title: string;
    @Input() message: string;
    @Input() confirmText: string;
    @Input() cancelText: string;
    @Input() confirm: () => void;
    @Input() cancel: () => void;
}
