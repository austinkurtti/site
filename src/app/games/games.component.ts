import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GamesService } from './games.service';

@Component({
    selector: 'ak-games',
    templateUrl: './games.component.html',
    host: {
        'class': 'd-flex flex-column h-100'
    },
    imports: [
        CommonModule,
        RouterOutlet
    ],
    providers: [
        GamesService
    ]
})
export class GamesComponent {
    public gamesService = inject(GamesService);

    public routerOutletActivate(activatedComponent: any) {
        this.gamesService.activeGame.set(this.gamesService.games.find(g => !g.disabled && activatedComponent instanceof g.class));
    }
}
