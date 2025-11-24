import { effect, Injectable, signal } from '@angular/core';
import { GameModel } from './games.models';
import { SudokuComponent } from './sudoku/sudoku.component';
import { WarshipsComponent } from './warships/warships.component';

@Injectable()
export class GamesService {
    public activeGame = signal<GameModel>(null);

    public games: GameModel[] = [
        new GameModel({
            name: 'Sudoku',
            icon: 'fas fa-border-all',
            route: 'sudoku',
            class: SudokuComponent
        }),
        new GameModel({
            name: 'Warships',
            icon: 'fas fa-anchor',
            route: 'warships',
            class: WarshipsComponent
        }),
        new GameModel({
            name: 'Solitaire',
            icon: 'fas fa-heart',
            route: 'solitaire',
            disabled: true
        })
    ];

    private _attrDataGameEffect = effect(() => {
        if (this.activeGame()) {
            document.documentElement.setAttribute('data-game', this.activeGame().name.toLowerCase().replaceAll(' ', '-'));
        } else {
            document.documentElement.removeAttribute('data-game');
        }
    });
}
