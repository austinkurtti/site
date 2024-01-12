import { Directive, HostBinding, OnDestroy, OnInit, inject } from '@angular/core';
import { MenuDirective } from './menu.directive';

@Directive({
    selector: '[akMenuContent]'
})
export class MenuContentDirective implements OnInit, OnDestroy {
    @HostBinding('attr.role') role = 'menu';

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
