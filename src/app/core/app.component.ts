import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { DialogDirective } from '@directives/dialog.directive';
import { DialogService } from '@services/dialog.service';

@Component({
    selector: 'ak-app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
    @ViewChild(DialogDirective, { static: true }) dialog: DialogDirective;

    constructor(
        private _dialogService: DialogService
    ) {}

    public ngAfterViewInit(): void {
        this._dialogService.dialogRef = this.dialog;
    }
}
