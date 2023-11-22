import { Directive, EventEmitter, Output, inject } from '@angular/core';
import { MenuDirective } from './menu.directive';

@Directive({
    selector: '[akMenuItem]',
    host: {
        'tabindex': '0',
        'role': 'menuitem',
        '(click)': 'itemClick($event)'
    }
})
export class MenuItemDirective {
    @Output() menuItemClick = new EventEmitter<string>();

    public menu = inject(MenuDirective);

    public itemClick(event: PointerEvent): void {
        this.menuItemClick.emit();
        this.menu.close();
    };
}
