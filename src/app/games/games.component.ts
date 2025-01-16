import { Component, Renderer2, inject } from '@angular/core';
import { TooltipPosition } from '@directives/tooltip/tooltip.directive';
import { GamesHomeComponent } from './games-home.component';
import { SudokuComponent } from './sudoku/sudoku.component';

@Component({
    selector: 'ak-games',
    styleUrls: ['./games.component.scss'],
    templateUrl: './games.component.html',
    standalone: false
})
export class GamesComponent {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    public TooltipPosition = TooltipPosition;

    private _renderer = inject(Renderer2);

    public routerOutletActivate(activatedComponent: any) {
        // Only supporting light theme for now
        document.documentElement.setAttribute('data-theme', 'light');

        const headerEl = document.querySelector('header');
        const titleEl = headerEl.children[0] as HTMLElement;
        const exitButtonEl = headerEl.children[1] as HTMLElement;
        const closeButtonEl = headerEl.children[2] as HTMLElement;
        if (activatedComponent instanceof GamesHomeComponent) {
            (titleEl.firstChild as HTMLElement).innerHTML = 'Games';
            this._renderer.removeAttribute(headerEl, 'data-game');
            this._renderer.removeClass(exitButtonEl, 'd-none');
            this._renderer.addClass(closeButtonEl, 'd-none');
        } else {
            this._renderer.addClass(exitButtonEl, 'd-none');
            this._renderer.removeClass(closeButtonEl, 'd-none');
        }

        if (activatedComponent instanceof SudokuComponent) {
            (titleEl.firstChild as HTMLElement).innerHTML = 'Sudoku';
            this._renderer.setAttribute(headerEl, 'data-game', 'sudoku');
        }
    }
}
