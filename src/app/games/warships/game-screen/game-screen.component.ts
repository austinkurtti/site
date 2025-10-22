import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { WarshipsManager } from '../warships-manager';
import { WarshipsGameState, WarshipsScreenState, WarshipsSector, WarshipsSectorState, WarshipsShipOrientation } from '../warships.models';

@Component({
    selector: 'ak-warships-game-screen',
    styleUrls: ['./game-screen.component.scss'],
    templateUrl: './game-screen.component.html',
    imports: [
        CommonModule
    ]
})
export class WarshipsGameScreenComponent implements OnInit {
    public gameManager = inject(WarshipsManager);

    public gameState = signal(WarshipsGameState.deploying);
    public deployableShips = computed(() => this.gameManager.gameInstance.playerGrid.ships().filter(ship => !ship.deployed));

    public Math = Math;
    public String = String;
    public GameState = WarshipsGameState;
    public SectorState = WarshipsSectorState;

    public ngOnInit(): void {
        this.gameManager.gameInstance.playerGrid.sectors = new Array(10).fill([]);
        for (let i = 0; i < 10; i++) {
            this.gameManager.gameInstance.playerGrid.sectors[i] = Array.from({ length: 10 }, () => new WarshipsSector());
        }
    }

    public shipDragStart = (event: DragEvent) => {
        const ship = event.currentTarget as HTMLElement;
        ship.id = 'dragged-ship';
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData('id', ship.getAttribute('data-ship-id'));
        event.dataTransfer.setData('length', ship.getAttribute('data-ship-length'));
        event.dataTransfer.setData('orientation', ship.getAttribute('data-ship-orientation'));
    }

    public shipDragEnd = (event: DragEvent) => {
        const ship = event.currentTarget as HTMLElement;
        ship.removeAttribute('id');
    }

    public sectorDragOver = (event: DragEvent) => {
        if (event.dataTransfer.types.includes('id')) {
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

        // Sector data
        const sector = event.currentTarget as HTMLElement;
        const row = parseInt(sector.getAttribute('data-row'), 10);
        const col = parseInt(sector.getAttribute('data-col'), 10);

        // Ship data
        const id = event.dataTransfer.getData('id');
        const length = parseInt(event.dataTransfer.getData('length'), 10) / 4;
        const orientation = parseInt(event.dataTransfer.getData('orientation'), 10);

        // Remove placeholder
        const placeholder = sector.querySelector('.deployable-ship-placeholder');
        placeholder?.remove();

        // Calculate occupied sectors
        const occupiedSectors: { r: number, c: number }[] = [];
        for (let i = 0; i < length; i++) {
            let r = row, c = col;
            if (orientation === WarshipsShipOrientation.horizontal) {
                c += i;
            } else {
                r += i;
            }

            if (r > 9 || c > 9 || this.gameManager.gameInstance.playerGrid.sectors[r][c].state.hasFlag(WarshipsSectorState.ship)) {
                // Out of bounds or overlaps another deployed ship, abort
                return;
            }
            occupiedSectors.push({ r, c });
        }

        // Place ship in all occupied sectors
        occupiedSectors.forEach(s => {
            this.gameManager.gameInstance.playerGrid.sectors[s.r][s.c].state = WarshipsSectorState.ship;
        });

        // Update player ships
        const updatedShips = this.gameManager.gameInstance.playerGrid.ships().map(ship => {
            if (id === ship.id) {
                ship.deployed = true;
            }
            return ship;
        });
        this.gameManager.gameInstance.playerGrid.ships.set(updatedShips);
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
