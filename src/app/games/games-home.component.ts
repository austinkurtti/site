import { Component } from '@angular/core';
import { GameLinkModel } from './games.models';

@Component({
    selector: 'ak-games-home',
    styleUrls: ['./games-home.component.scss'],
    templateUrl: './games-home.component.html'
})
export class GamesHomeComponent {
    public games: GameLinkModel[] = [
        new GameLinkModel({
            name: 'Sudoku',
            icon: 'fas fa-border-all',
            route: 'sudoku'
        }),
        new GameLinkModel({
            name: 'Solitaire',
            icon: 'fas fa-heart',
            route: 'solitaire'
        }),
        new GameLinkModel({
            name: 'Warships',
            icon: 'fas fa-anchor',
            route: 'warships',
            disabled: true
        })
    ];
}
