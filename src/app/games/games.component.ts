import { Component, Renderer2, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ThemeComponent } from '@components/theme/theme.component';
import { MenuContentDirective } from '@directives/menu/menu-content.directive';
import { MenuDirective, MenuPosition } from '@directives/menu/menu.directive';
import { TooltipPosition } from '@directives/tooltip/tooltip.directive';
import { TooltipDirective } from '../@directives/tooltip/tooltip.directive';
import { GamesHomeComponent } from './games-home.component';
import { SudokuComponent } from './sudoku/sudoku.component';

@Component({
    selector: 'ak-games',
    styleUrls: ['./games.component.scss'],
    templateUrl: './games.component.html',
    imports: [
        MenuDirective,
        MenuContentDirective,
        RouterLink,
        RouterOutlet,
        ThemeComponent,
        TooltipDirective
    ]
})
export class GamesComponent {
    public MenuPosition = MenuPosition;
    public TooltipPosition = TooltipPosition;

    private _renderer = inject(Renderer2);

    public routerOutletActivate(activatedComponent: any) {
        const akGamesEl = document.querySelector('ak-games');
        const headerEl = document.querySelector('header');
        const titleEl = headerEl.children[0] as HTMLElement;
        const exitButtonEl = document.querySelector('#exit-button');
        const closeButtonEl = document.querySelector('#close-button');
        if (activatedComponent instanceof GamesHomeComponent) {
            (titleEl.firstChild as HTMLElement).innerHTML = 'Games';
            this._renderer.removeAttribute(akGamesEl, 'data-game');
            this._renderer.removeClass(exitButtonEl, 'd-none');
            this._renderer.addClass(closeButtonEl, 'd-none');
        } else {
            this._renderer.addClass(exitButtonEl, 'd-none');
            this._renderer.removeClass(closeButtonEl, 'd-none');
        }

        if (activatedComponent instanceof SudokuComponent) {
            (titleEl.firstChild as HTMLElement).innerHTML = 'Sudoku';
            this._renderer.setAttribute(akGamesEl, 'data-game', 'sudoku');
        }
    }
}
