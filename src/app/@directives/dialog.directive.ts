import { Directive, ElementRef, ViewContainerRef } from '@angular/core';

@Directive({
    selector: '[akDialog]'
})
export class DialogDirective {
    constructor(
        public elementRef: ElementRef,
        public viewContainerRef: ViewContainerRef
    ) {}
}
