import { Component, inject } from '@angular/core';
import { WarshipsManager } from '../warships-manager';

@Component({
    selector: 'ak-warships-menu-screen',
    styleUrls: ['./menu-screen.component.scss'],
    templateUrl: './menu-screen.component.html'
})
export class WarshipsMenuScreenComponent {
    public gameManager = inject(WarshipsManager);

    public showSettingsDialog(): void {
        // TODO
    }
}
