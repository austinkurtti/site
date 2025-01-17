import { AfterViewInit, Component, ViewChild, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DialogDirective } from '@directives/dialog/dialog.directive';
import { DialogService } from '@services/dialog.service';

@Component({
    selector: 'ak-app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    imports: [
        DialogDirective,
        RouterOutlet
    ]
})
export class AppComponent implements AfterViewInit {
    @ViewChild(DialogDirective, { static: true }) dialog: DialogDirective;

    private _dialogService = inject(DialogService);

    public ngAfterViewInit(): void {
        this._dialogService.dialogRef = this.dialog;
    }
}
