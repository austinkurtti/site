import { Component, inject } from '@angular/core';
import { GamesService } from '../../games.service';
import { WarshipsManager } from '../warships-manager';
import { WarshipsScreenState } from '../warships.models';

@Component({
    selector: 'ak-warships-menu-screen',
    styleUrls: ['./menu-screen.component.scss'],
    templateUrl: './menu-screen.component.html'
})
export class WarshipsMenuScreenComponent {
    public gameManager = inject(WarshipsManager);
    public gamesService = inject(GamesService);

    public ScreenState = WarshipsScreenState;
}
