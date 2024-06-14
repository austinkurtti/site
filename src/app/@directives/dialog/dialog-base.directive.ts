import { AfterViewInit, Directive, ElementRef, inject } from '@angular/core';
import { DialogService } from '@services/dialog.service';

@Directive()
export class DialogBaseDirective implements AfterViewInit {
    public elementRef = inject(ElementRef);

    public closeCallback: () => void;

    protected dialogService = inject(DialogService);

    public ngAfterViewInit(): void {
        this.dialogService.initDialogFocus();
    }
}
