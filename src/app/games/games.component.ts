import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { GameLinkModel } from './games.models';

@Component({
    selector: 'ak-games',
    styleUrls: ['./games.component.scss'],
    templateUrl: './games.component.html'
})
export class GamesComponent implements OnDestroy {
    @ViewChild('gameLinks') gameLinksEl: ElementRef;

    public showHome = true;
    public games: GameLinkModel[] = [
        new GameLinkModel({
            name: 'Sudoku',
            icon: 'fas fa-border-all',
            route: 'sudoku'
        }),
        new GameLinkModel({
            name: 'Solitaire',
            icon: 'fas fa-heart',
            route: 'solitaire',
            disabled: true
        }),
        new GameLinkModel({
            name: 'Warships',
            icon: 'fas fa-anchor',
            route: 'warships',
            disabled: true
        })
    ];

    private _destroyed$ = new Subject<void>();

    public ngOnDestroy(): void {
        this._destroyed$.next();
    }

    public gameActivate(): void {
        this.showHome = false;
    }

    public gameDeactivate(): void {
        this.showHome = true;
    }
}
