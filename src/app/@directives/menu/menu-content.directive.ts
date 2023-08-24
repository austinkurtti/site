import { Directive, OnDestroy, OnInit, inject } from '@angular/core';
import { MenuDirective } from './menu.directive';

@Directive({
    selector: '[akMenuContent]',
    host: {
        'role': 'menu'
    }
})
export class MenuContentDirective implements OnInit, OnDestroy {
    public menu = inject(MenuDirective);

    public ngOnInit(): void {
        document.addEventListener('click', this._closeMenuEventListener);
    }

    public ngOnDestroy(): void {
        document.removeEventListener('click', this._closeMenuEventListener);
    }

    private _closeMenuEventListener = (event: PointerEvent): void => {
        // If this click event happens at all, then a click has occurred outside the menu
        this.menu.close();
    };
}
