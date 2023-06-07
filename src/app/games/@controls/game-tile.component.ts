import { Component, HostBinding, HostListener, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'ak-game-tile',
    styleUrls: ['./game-tile.component.scss'],
    templateUrl: './game-tile.component.html'
})
export class GameTileComponent {
    @Input() icon: string;
    @Input() name: string;
    @Input() route: string;
    @Input() active = true;

    constructor(
        private _router: Router
    ) {}

    @HostBinding('id') get id() {
        return this.name.toLowerCase();
    }

    @HostBinding('class.inactive') get classInactive() {
        return !this.active;
    }

    @HostListener('click')
    public routeToGame() {
        if (this.active) {
            this._router.navigateByUrl(`/games/${this.route}`);
        }
    }
}
