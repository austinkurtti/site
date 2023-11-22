import { ElementRef, inject } from '@angular/core';
import { DialogService } from '@services/dialog.service';

export class DialogBase {
    public elementRef = inject(ElementRef);

    public closeCallback: () => void;

    protected dialogService = inject(DialogService);
}
