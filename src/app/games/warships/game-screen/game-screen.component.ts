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
    public deployedShips = computed(() => this.gameManager.gameInstance.playerGrid.ships().filter(ship => ship.deployed));

    public Math = Math;
    public String = String;
    public GameState = WarshipsGameState;
    public SectorState = WarshipsSectorState;
    public ShipOrientation = WarshipsShipOrientation;

    public ngOnInit(): void {
        this.gameManager.gameInstance.playerGrid.sectors = new Array(10).fill([]);
        for (let i = 0; i < 10; i++) {
            this.gameManager.gameInstance.playerGrid.sectors[i] = Array.from({ length: 10 }, () => new WarshipsSector());
        }
    }

    public shipDragStart = (event: DragEvent): void => {
        const ship = event.currentTarget as HTMLElement;
        ship.id = 'dragged-ship';
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData('shipid', ship.getAttribute('data-ship-id'));
        event.dataTransfer.setData('length', ship.getAttribute('data-ship-length'));
        event.dataTransfer.setData('orientation', ship.getAttribute('data-ship-orientation'));
    }

    public shipDragEnd = (event: DragEvent): void => {
        const ship = event.currentTarget as HTMLElement;
        ship.removeAttribute('id');
    }

    public sectorDragOver = (event: DragEvent): void => {
        if (event.dataTransfer.types.includes('shipid')) {
            // Sector data
            const sector = event.currentTarget as HTMLElement;
            const row = parseInt(sector.getAttribute('data-row'), 10);
            const col = parseInt(sector.getAttribute('data-col'), 10);

            // Ship data
            const draggedShip = document.getElementById('dragged-ship');
            const length = parseInt(draggedShip.getAttribute('data-ship-length'), 10);
            const orientation = parseInt(draggedShip.getAttribute('data-ship-orientation'), 10);

            // Clear placeholders
            const grid = sector.parentElement;
            this._clearShipPlaceholders(grid);

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

            event.preventDefault();

            occupiedSectors.forEach(s => {
                const selector = `.sector[data-row="${s.r}"][data-col="${s.c}"]`;
                grid.querySelector(selector).appendChild(this._createShipPlaceholder(draggedShip));
            });
        }
    }

    public sectorDragLeave = (event: DragEvent): void => {
        const sector = event.currentTarget as HTMLElement;
        const placeholder = sector.querySelector('.deployable-ship-placeholder');
        placeholder?.remove();
    }

    public sectorDrop = (event: DragEvent): void => {
        event.preventDefault();

        // Sector data
        const sector = event.currentTarget as HTMLElement;
        const grid = sector.parentElement as HTMLElement;
        const row = parseInt(sector.getAttribute('data-row'), 10);
        const col = parseInt(sector.getAttribute('data-col'), 10);

        // Ship data
        const id = event.dataTransfer.getData('shipid');
        const length = parseInt(event.dataTransfer.getData('length'), 10);
        const orientation = parseInt(event.dataTransfer.getData('orientation'), 10);

        // Clear placeholders
        this._clearShipPlaceholders(grid);

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
                ship.anchorSector = { r: row, c: col };
            }
            return ship;
        });
        this.gameManager.gameInstance.playerGrid.ships.set(updatedShips);
    }

    public gridDragLeave = (event: DragEvent): void => {
        this._clearShipPlaceholders(event.currentTarget as HTMLElement);
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
        const ngAttr = Array.from(draggedShip.attributes).find(a => a.name.startsWith('_ngcontent'));
        if (ngAttr) {
            placeholder.setAttribute(ngAttr.name, '');
        }
        return placeholder;
    }

    private _clearShipPlaceholders(grid: HTMLElement) {
        grid.querySelectorAll('.deployable-ship-placeholder').forEach(el => el.remove());
    }
}
