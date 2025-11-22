import { AfterViewInit, Component, ViewChild, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppDialogDirective } from '@directives/dialog/app-dialog.directive';
import { AppNewsflashDirective } from '@directives/newsflash/app-newsflash.directive';
import { DialogService } from '@services/dialog.service';
import { NewsflashService } from '@services/newsflash.service';
import { ThemeService } from '@services/theme.service';

@Component({
    selector: 'ak-app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    imports: [
        AppDialogDirective,
        AppNewsflashDirective,
        RouterOutlet
    ]
})
export class AppComponent implements AfterViewInit {
    @ViewChild(AppDialogDirective, { static: true }) appDialog: AppDialogDirective;
    @ViewChild(AppNewsflashDirective, { static: true }) appNewsflash: AppNewsflashDirective;

    private _dialogService = inject(DialogService);
    private _newsflashService = inject(NewsflashService);
    private _themeService = inject(ThemeService); // Injected here just so it gets constructed and theme is applied

    public ngAfterViewInit(): void {
        this._dialogService.appDialogRef = this.appDialog;
        this._newsflashService.appNewsflashRef = this.appNewsflash;
    }
}
