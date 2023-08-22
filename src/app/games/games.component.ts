import { Component, Renderer2, inject } from '@angular/core';
import { GamesHomeComponent } from './games-home.component';

@Component({
    selector: 'ak-games',
    styleUrls: ['./games.component.scss'],
    templateUrl: './games.component.html'
})
export class GamesComponent {
    private _renderer = inject(Renderer2);

    public routerOutletActivate(activatedComponent: any) {
        const headerEl = document.querySelector('header');
        const buttonEl = headerEl.children[0] as HTMLElement;
        const titleEl = headerEl.children[1] as HTMLElement;
        if (activatedComponent instanceof GamesHomeComponent) {
            this._renderer.removeClass(buttonEl, 'show');
            this._renderer.setAttribute(buttonEl, 'tabindex', '-1');
            if (document.activeElement === buttonEl) {
                buttonEl.blur();
            }
            this._renderer.addClass(titleEl, 'ps-5');
        } else {
            this._renderer.addClass(buttonEl, 'show');
            this._renderer.setAttribute(buttonEl, 'tabindex', '0');
            this._renderer.removeClass(titleEl, 'ps-5');
        }
    }
}
