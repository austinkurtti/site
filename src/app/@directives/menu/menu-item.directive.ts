import { Directive, EventEmitter, HostBinding, HostListener, Output, inject } from '@angular/core';
import { MenuDirective } from './menu.directive';

@Directive({ selector: '[akMenuItem]' })
export class MenuItemDirective {
    @Output() menuItemClick = new EventEmitter<string>();

    @HostBinding('attr.tabindex') tabindex = 0;
    @HostBinding('attr.role') role = 'menuitem';

    public menu = inject(MenuDirective);

    @HostListener('click', ['$event']) itemClick(event: PointerEvent): void {
        this.menuItemClick.emit();
        this.menu.close();
    }
}
