import { CommonModule } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { WarshipsManager } from '../warships-manager';
import { WarshipsGameState } from '../warships.models';

@Component({
    selector: 'ak-warships-fleet-status',
    styleUrl: './fleet-status.component.scss',
    templateUrl: './fleet-status.component.html',
    imports: [
        CommonModule
    ]
})
export class WarshipsFleetStatusComponent {
    public gameManager = inject(WarshipsManager);

    public isPlayer = input<boolean>();
    public fleet = computed(() => {
        return this.isPlayer()
            ? this.gameManager.gameInstance.playerGrid.ships()
            : this.gameManager.gameInstance.computerGrid.ships();
    });
    public fleetDestroyed = computed(() => {
        return (this.isPlayer() && this.gameManager.gameInstance.gameState() === WarshipsGameState.defeat)
            || (!this.isPlayer() && this.gameManager.gameInstance.gameState() === WarshipsGameState.victory);
    });

    public GameState = WarshipsGameState;
}
