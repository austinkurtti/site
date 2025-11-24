import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { WarshipsEndGameScreenComponent } from "./end-game-screen/end-game-screen.component";
import { WarshipsGameScreenComponent } from './game-screen/game-screen.component';
import { WarshipsMenuScreenComponent } from './menu-screen/menu-screen.component';
import { WarshipsManager } from './warships-manager';
import { WarshipsScreenState } from './warships.models';

@Component({
    selector: 'ak-warships',
    templateUrl: './warships.component.html',
    imports: [
        CommonModule,
        WarshipsGameScreenComponent,
        WarshipsMenuScreenComponent,
        WarshipsEndGameScreenComponent
    ],
    providers: [
        WarshipsManager
    ]
})
export class WarshipsComponent {
    public gameManager = inject(WarshipsManager);

    public ScreenState = WarshipsScreenState;
}
