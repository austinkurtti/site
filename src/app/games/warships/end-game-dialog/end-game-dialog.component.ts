import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { DialogBaseDirective } from '@directives/dialog/dialog-base.directive';
import { WarshipsFleetStatusComponent } from '../fleet-status/fleet-status.component';
import { WarshipsManager } from '../warships-manager';
import { WarshipsGameState } from '../warships.models';

@Component({
    selector: 'ak-warships-end-game-dialog',
    styleUrls: ['./end-game-dialog.component.scss'],
    templateUrl: './end-game-dialog.component.html',
    imports: [
        CommonModule,
        WarshipsFleetStatusComponent
    ]
})
export class WarshipsEndGameDialogComponent extends DialogBaseDirective {
    public gameManager = inject(WarshipsManager);

    public playAgain: () => void;
    public exit: () => void;

    public GameState = WarshipsGameState;
}
