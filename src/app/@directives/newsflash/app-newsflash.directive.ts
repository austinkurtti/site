import { Directive, ElementRef, inject, ViewContainerRef } from '@angular/core';

@Directive({
    selector: '[akAppNewsflash]'
})
export class AppNewsflashDirective {
    public elementRef = inject(ElementRef);
    public viewContainerRef = inject(ViewContainerRef);
}
