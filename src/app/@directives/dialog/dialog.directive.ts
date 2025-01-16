import { Directive, ElementRef, ViewContainerRef, inject } from '@angular/core';

@Directive({
    selector: '[akDialog]',
    standalone: false
})
export class DialogDirective {
    public elementRef = inject(ElementRef);
    public viewContainerRef = inject(ViewContainerRef);
}
