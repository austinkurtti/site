import { Directive, ElementRef, ViewContainerRef, inject } from '@angular/core';

@Directive({ selector: '[akAppDialog]' })
export class AppDialogDirective {
    public elementRef = inject(ElementRef);
    public viewContainerRef = inject(ViewContainerRef);
}
