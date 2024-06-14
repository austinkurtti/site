import { Component } from '@angular/core';
import { DialogBaseDirective } from '@directives/dialog/dialog-base.directive';

@Component({
    standalone: true,
    selector: 'ak-help-dialog',
    styleUrls: ['./help-dialog.component.scss'],
    templateUrl: './help-dialog.component.html'
})
export class HelpDialogComponent extends DialogBaseDirective {}
