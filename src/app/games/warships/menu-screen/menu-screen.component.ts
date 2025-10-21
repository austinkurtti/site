import { Component, inject } from '@angular/core';
import { WarshipsManager } from '../warships-manager';
import { WarshipsGameInstance, WarshipsScreenState } from '../warships.models';

@Component({
    selector: 'ak-warships-menu-screen',
    styleUrls: ['./menu-screen.component.scss'],
    templateUrl: './menu-screen.component.html'
})
export class WarshipsMenuScreenComponent {
    public gameManager = inject(WarshipsManager);

    public start(): void {
        this.gameManager.gameInstance = new WarshipsGameInstance();
        this.gameManager.screen.set(WarshipsScreenState.game);
    }
}
