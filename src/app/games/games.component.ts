import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { GameLinkModel } from './games.models';

@Component({
    selector: 'ak-games',
    styleUrls: ['./games.component.scss'],
    templateUrl: './games.component.html'
})
export class GamesComponent {
    @ViewChild('gameLinks') gameLinksEl: ElementRef;

    public navOpen = true;
    public showPlaceholder = true;
    public games: GameLinkModel[] = [
        new GameLinkModel('Sudoku', 'fas fa-border-all', 'sudoku'),
        // new GameLinkModel('Solitaire', 'fas fa-heart', 'solitaire'),
        // new GameLinkModel('Warship', 'fas fa-ship', 'warship')
    ];

    constructor(
        private _renderer: Renderer2
    ) {}

    public toggleNav(): void {
        this.navOpen = !this.navOpen;
        if (this.navOpen) {
            this._renderer.removeStyle(this.gameLinksEl.nativeElement, 'transform');
        } else {
            this._renderer.setStyle(this.gameLinksEl.nativeElement, 'transform', 'translateX(-100%)');
        }
    }
}
