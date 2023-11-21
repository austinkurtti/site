import { Component } from '@angular/core';
import { DialogBase } from '@directives/dialog/dialog-base';

@Component({
    standalone: true,
    selector: 'ak-help-dialog',
    styleUrls: ['./help-dialog.component.scss'],
    templateUrl: './help-dialog.component.html'
})
export class HelpDialogComponent extends DialogBase {}
