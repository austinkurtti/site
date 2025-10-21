import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GameLinkModel } from './games.models';

@Component({
    selector: 'ak-games-home',
    styleUrls: ['./games-home.component.scss'],
    templateUrl: './games-home.component.html',
    imports: [
        CommonModule,
        RouterLink
    ]
})
export class GamesHomeComponent {
    public games: GameLinkModel[] = [
        new GameLinkModel({
            name: 'Sudoku',
            icon: 'fas fa-border-all',
            route: 'sudoku'
        }),
        new GameLinkModel({
            name: 'Warships',
            icon: 'fas fa-anchor',
            route: 'warships'
        }),
        new GameLinkModel({
            name: 'Solitaire',
            icon: 'fas fa-heart',
            route: 'solitaire',
            disabled: true
        })
    ];
}
