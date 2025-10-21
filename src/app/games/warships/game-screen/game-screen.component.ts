import { Component, inject } from '@angular/core';
import { WarshipsManager } from '../warships-manager';
import { WarshipsScreenState } from '../warships.models';

@Component({
    selector: 'ak-warships-game-screen',
    styleUrls: ['./game-screen.component.scss'],
    templateUrl: './game-screen.component.html'
})
export class WarshipsGameScreenComponent {
    public gameManager = inject(WarshipsManager);

    public showSettingsDialog(): void {
        // TODO
    }

    public quit(): void {
        this.gameManager.gameInstance = null;
        this.gameManager.screen.set(WarshipsScreenState.menu);
    }
}
