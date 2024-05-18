import { Component, Renderer2, inject } from '@angular/core';
import { TooltipPosition } from '@directives/tooltip/tooltip.directive';
import { GamesHomeComponent } from './games-home.component';
import { SudokuComponent } from './sudoku/sudoku.component';

@Component({
    selector: 'ak-games',
    styleUrls: ['./games.component.scss'],
    templateUrl: './games.component.html'
})
export class GamesComponent {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    public TooltipPosition = TooltipPosition;

    private _renderer = inject(Renderer2);

    public routerOutletActivate(activatedComponent: any) {
        // Only supporting light theme for now
        document.documentElement.setAttribute('data-theme', 'light');

        const headerEl = document.querySelector('header');
        const backButtonEl = headerEl.children[0] as HTMLElement;
        const titleEl = headerEl.children[1] as HTMLElement;
        const exitButtonEl = headerEl.children[2] as HTMLElement;
        if (activatedComponent instanceof GamesHomeComponent) {
            (titleEl.firstChild as HTMLElement).innerHTML = 'Games';
            this._renderer.removeAttribute(headerEl, 'data-game');
            this._renderer.addClass(backButtonEl, 'd-none');
            this._renderer.setAttribute(backButtonEl, 'tabindex', '-1');
            this._renderer.addClass(titleEl, 'ps-3');
            this._renderer.addClass(titleEl, 'ps-lg-5');
            this._renderer.removeClass(exitButtonEl, 'd-none');
        } else {
            this._renderer.removeClass(backButtonEl, 'd-none');
            this._renderer.setAttribute(backButtonEl, 'tabindex', '0');
            this._renderer.removeClass(titleEl, 'ps-3');
            this._renderer.removeClass(titleEl, 'ps-lg-5');
            this._renderer.addClass(exitButtonEl, 'd-none');
        }

        if (activatedComponent instanceof SudokuComponent) {
            (titleEl.firstChild as HTMLElement).innerHTML = 'Sudoku';
            this._renderer.setAttribute(headerEl, 'data-game', 'sudoku');
        }
    }
}
