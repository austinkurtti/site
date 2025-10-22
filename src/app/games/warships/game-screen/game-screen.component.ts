import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { WarshipsManager } from '../warships-manager';
import { WarshipsGameState, WarshipsScreenState, WarshipsShip } from '../warships.models';

@Component({
    selector: 'ak-warships-game-screen',
    styleUrls: ['./game-screen.component.scss'],
    templateUrl: './game-screen.component.html',
    imports: [
        CommonModule
    ]
})
export class WarshipsGameScreenComponent {
    public gameManager = inject(WarshipsManager);

    public gameState = signal(WarshipsGameState.deploying);
    public deployableShips = [
        new WarshipsShip('Carrier', 5),
        new WarshipsShip('Battleship', 4),
        new WarshipsShip('Destroyer', 3),
        new WarshipsShip('Submarine', 3),
        new WarshipsShip('Patrol Ship', 2)
    ];

    public GameState = WarshipsGameState;
    public String = String;

    public shipDragStart = (event: DragEvent) => {
        const ship = event.currentTarget as HTMLElement;
        ship.id = 'dragged-ship';
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData('ship', ship.getAttribute('data-ship'));
    }

    public shipDragEnd = (event: DragEvent) => {
        const ship = event.currentTarget as HTMLElement;
        ship.removeAttribute('id');
    }

    public sectorDragOver = (event: DragEvent) => {
        if (event.dataTransfer.types.includes('ship')) {
            const sector = event.currentTarget as HTMLElement;
            const draggedShip = document.getElementById('dragged-ship');
            const existingShip = sector.querySelector('.deployable-ship');

            if (!existingShip) {
                event.preventDefault();

                const existingPlaceholder = sector.querySelector('.deployable-ship-placeholder');
                if (!existingPlaceholder) {
                    sector.appendChild(this._createShipPlaceholder(draggedShip));
                }
            }
        }
    }

    public sectorDragLeave = (event: DragEvent) => {
        const sector = event.currentTarget as HTMLElement;
        const placeholder = sector.querySelector('.deployable-ship-placeholder');
        placeholder?.remove();
    }

    public sectorDrop = (event: DragEvent) => {
        event.preventDefault();

        const sector = event.currentTarget as HTMLElement;
        const placeholder = sector.querySelector('.deployable-ship-placeholder');
        placeholder?.remove();

        const draggedShip = document.getElementById('dragged-ship');
        draggedShip.remove();
        sector.appendChild(draggedShip);
    }

    public showSettingsDialog(): void {
        // TODO
    }

    public quit(): void {
        this.gameManager.gameInstance = null;
        this.gameManager.screen.set(WarshipsScreenState.menu);
    }

    private _createShipPlaceholder(draggedShip: HTMLElement) {
        const placeholder = document.createElement('div');
        placeholder.classList.add('deployable-ship-placeholder');
        placeholder.setAttribute(draggedShip.getAttributeNames().filter(name => name.startsWith('_ngcontent'))[0], '');
        return placeholder;
    }
}
