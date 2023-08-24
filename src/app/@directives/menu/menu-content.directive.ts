import { Directive, ElementRef, inject } from '@angular/core';

@Directive({
    selector: '[akMenuContent]',
    host: {
        'role': 'menu'
    }
})
export class MenuContentDirective {
    public elementRef = inject(ElementRef);
}
