import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnDestroy, OnInit, Renderer2, signal } from '@angular/core';
import { timer } from 'rxjs';
import { take } from 'rxjs/operators';
import { WarshipsManager } from '../warships-manager';
import { tryShipDeploy } from '../warships.functions';
import { WarshipsGameState, WarshipsGrid, WarshipsScreenState, WarshipsSector, WarshipsSectorState, WarshipsShipOrientation, WarshipsTurn } from '../warships.models';

@Component({
    selector: 'ak-warships-game-screen',
    styleUrls: ['./game-screen.component.scss'],
    templateUrl: './game-screen.component.html',
    imports: [
        CommonModule
    ]
})
export class WarshipsGameScreenComponent implements OnInit, OnDestroy {
    public gameManager = inject(WarshipsManager);

    public gameState = signal(WarshipsGameState.deploying);
    public showPlaceholder = signal(false);
    public gridSectors = computed(() => {
        return this.gameState() === WarshipsGameState.deploying || this.gameManager.gameInstance.turn() === WarshipsTurn.computer
            ? this.gameManager.gameInstance.playerGrid.sectors
            : this.gameManager.gameInstance.computerGrid.sectors;
    });
    public deployableShips = computed(() => this.gameManager.gameInstance.playerGrid.ships().filter(ship => !ship.deployed));
    public deployedShips = computed(() => {
        return this.gameState() === WarshipsGameState.deploying || this.gameManager.gameInstance.turn() === WarshipsTurn.computer
            ? this.gameManager.gameInstance.playerGrid.ships().filter(ship => ship.deployed)
            : [];
    });

    public get playerGrid(): WarshipsGrid {
        return this.gameManager.gameInstance.playerGrid;
    }
    public get computerGrid(): WarshipsGrid {
        return this.gameManager.gameInstance.computerGrid;
    }

    public Math = Math;
    public String = String;
    public GameState = WarshipsGameState;
    public SectorState = WarshipsSectorState;
    public ShipOrientation = WarshipsShipOrientation;
    public Turn = WarshipsTurn;

    private _renderer = inject(Renderer2);

    private _unlisteners: (() => void)[] = [];

    public ngOnInit(): void {
        this.playerGrid.sectors = new Array(10).fill([]);
        for (let i = 0; i < 10; i++) {
            this.playerGrid.sectors[i] = Array.from({ length: 10 }, () => new WarshipsSector());
        }
        this.computerGrid.sectors = new Array(10).fill([]);
        for (let i = 0; i < 10; i++) {
            this.computerGrid.sectors[i] = Array.from({ length: 10 }, () => new WarshipsSector());
        }
    }

    public ngOnDestroy(): void {
        this._unlisten();
    }

    public shipDragStart = (event: DragEvent): void => {
        this.showPlaceholder.set(true);

        // Listen for dragend at document level to detect off-grid or off-screen drops
        this._unlisteners.push(this._renderer.listen(document, 'dragend', this._documentDragEnd));

        const ship = event.currentTarget as HTMLElement;
        ship.id = 'dragged-ship';

        // Set ship data
        const shipId = ship.getAttribute('data-ship-id');
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData('shipid', shipId);
        event.dataTransfer.setData('length', ship.getAttribute('data-ship-length'));
        event.dataTransfer.setData('orientation', ship.getAttribute('data-ship-orientation'));

        if (ship.classList.contains('deployed-ship')) {
            // Set temporary styles for deployed ship to prevent it from blocking dragover events
            const shipRect = ship.getBoundingClientRect();
            ship.style.border = 'none';
            ship.style.height = `${shipRect.height}px`;
            ship.style.width = `${shipRect.width}px`;
            ship.style.position = 'absolute';

            // Short delay for invisibility to allow browser to capture the element for dragging before it disappears
            timer(10).pipe(take(1)).subscribe(() => {
                ship.style.visibility = 'hidden';
            });

            // Reset sectors containing deployed ship
            const deployedShip = this.playerGrid.ships().find(s => s.id === shipId);
            for (let i = 0; i < deployedShip.length; i++) {
                let r = deployedShip.anchorSector.r, c = deployedShip.anchorSector.c;
                if (deployedShip.orientation === WarshipsShipOrientation.horizontal) {
                    c += i;
                } else {
                    r += i;
                }

                this.playerGrid.sectors[r][c].state = WarshipsSectorState.empty;
            }
        }
    }

    public shipDragEnd = (event: DragEvent): void => {
        const ship = event.currentTarget as HTMLElement;
        ship.removeAttribute('id');
    }

    // TODO - look into splitting this between dragenter and dragleave
    //      - it's pretty wasteful to be running this callback potentially hundreds of times within the same sector
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
            this._clearPlaceholders(grid);

            // Attempt to position placeholder
            const occupiedSectors = tryShipDeploy(row, col, length, orientation, this.playerGrid.sectors);
            if (occupiedSectors.length === 0) {
                // Abort - positioning failed
                return;
            }

            event.preventDefault();
            event.dataTransfer.dropEffect = 'move';

            // Mark sectors as occupied with ship
            occupiedSectors.forEach(s => {
                this.playerGrid.sectors[s.r][s.c].state = WarshipsSectorState.placeholder;
            });

            // Move placeholder
            const deployableShipPlaceholder = grid.querySelector('#deployable-ship-placeholder') as HTMLElement;
            deployableShipPlaceholder.style.display = 'block';
            deployableShipPlaceholder.style.height = '100%';
            deployableShipPlaceholder.style.width = '100%';
            deployableShipPlaceholder.style.gridRowStart = (row + 1).toString();
            deployableShipPlaceholder.style.gridColumnStart = (col + 1).toString();
            if (orientation === WarshipsShipOrientation.horizontal) {
                deployableShipPlaceholder.style.gridRowEnd = 'span 1';
                deployableShipPlaceholder.style.gridColumnEnd = `span ${length}`;
            } else {
                deployableShipPlaceholder.style.gridRowEnd = `span ${length}`;
                deployableShipPlaceholder.style.gridColumnEnd = 'span 1';
            }
        }
    }

    public sectorDrop = (event: DragEvent): void => {
        event.preventDefault();
        this.showPlaceholder.set(false);

        // Sector data
        const sector = event.currentTarget as HTMLElement;
        const grid = sector.parentElement as HTMLElement;
        const row = parseInt(sector.getAttribute('data-row'), 10);
        const col = parseInt(sector.getAttribute('data-col'), 10);

        // Ship data
        const draggedShip = document.getElementById('dragged-ship');
        const id = event.dataTransfer.getData('shipid');
        const length = parseInt(event.dataTransfer.getData('length'), 10);
        const orientation = parseInt(event.dataTransfer.getData('orientation'), 10);

        // Clear placeholders
        this._clearPlaceholders(grid);

        // Unset temporary styles
        draggedShip.style.border = '';
        draggedShip.style.height = '';
        draggedShip.style.width = '';
        draggedShip.style.position = '';
        draggedShip.style.visibility = '';

        // Attempt deployment
        const occupiedSectors = tryShipDeploy(row, col, length, orientation, this.playerGrid.sectors);
        if (occupiedSectors.length === 0) {
            // Abort - deploy failed
            return;
        }

        // Place ship in all occupied sectors
        occupiedSectors.forEach(s => {
            this.playerGrid.sectors[s.r][s.c].state = WarshipsSectorState.ship;
        });

        // Update player ships
        const updatedShips = this.playerGrid.ships().map(ship => {
            if (id === ship.id) {
                ship.deployed = true;
                ship.anchorSector = { r: row, c: col };
            }
            return ship;
        });
        this.playerGrid.ships.set(updatedShips);
    }

    public gridDragLeave = (event: DragEvent): void => {
        this._clearPlaceholders(event.currentTarget as HTMLElement);
    }

    public rotateShip(shipId: string) {
        const ship = this.playerGrid.ships().find(s => s.id === shipId);

        // Calculate new sectors (minus anchor sector)
        const newSectors: { r: number, c: number }[] = [];
        for (let i = 1; i < ship.length; i++) {
            let r = ship.anchorSector.r, c = ship.anchorSector.c;
            if (ship.orientation === WarshipsShipOrientation.horizontal) {
                r += i;
            } else {
                c += i;
            }

            if (r > 9 || c > 9 || this.playerGrid.sectors[r][c].state.hasFlag(WarshipsSectorState.ship)) {
                // Out of bounds or overlaps another deployed ship, abort
                return;
            }
            newSectors.push({ r, c });
        }

        // Reset old sectors to empty (minus anchor sector)
        for (let i = 1; i < ship.length; i++) {
            let r = ship.anchorSector.r, c = ship.anchorSector.c;
            if (ship.orientation === WarshipsShipOrientation.horizontal) {
                c += i;
            } else {
                r += i;
            }

            this.playerGrid.sectors[r][c].state = WarshipsSectorState.empty;
        }

        // Update new sectors and ship data
        newSectors.forEach(n => {
            this.playerGrid.sectors[n.r][n.c].state = WarshipsSectorState.ship;
        });
        ship.orientation = ship.orientation === WarshipsShipOrientation.horizontal
            ? WarshipsShipOrientation.vertical
            : WarshipsShipOrientation.horizontal;
        this.playerGrid.ships.set(this.playerGrid.ships());
    }

    public deploy(): void {
        // Randomly deploy computer's ships
        this.computerGrid.ships().forEach(ship => {
            while (!ship.deployed) {
                const row = Math.floor(Math.random() * 10);
                const col = Math.floor(Math.random() * 10);
                ship.orientation = Math.floor(Math.random() * 2) + 1;
                const occupiedSectors = tryShipDeploy(row, col, ship.length, ship.orientation, this.computerGrid.sectors);

                if (occupiedSectors.length > 0) {
                    ship.deployed = true;
                    ship.anchorSector = { r: row, c: col };

                    // Mark sectors with ship
                    occupiedSectors.forEach(s => {
                        this.computerGrid.sectors[s.r][s.c].state = WarshipsSectorState.ship;
                    });
                }
            }
        });
        this.computerGrid.ships.set(this.computerGrid.ships());

        this.gameState.set(WarshipsGameState.running);
        // TODO - start game loop
    }

    public showSettingsDialog(): void {
        // TODO
    }

    public quit(): void {
        this.gameManager.gameInstance = null;
        this.gameManager.screen.set(WarshipsScreenState.menu);
    }

    private _documentDragEnd = (event: DragEvent): void => {
        this._unlisten();

        // Check if sector drop event ever fired, it should be the only place that sets showPlaceholder to false
        if (this.showPlaceholder()) {
            // Reset the dragged ship back to not deployed
            const draggedShip = event.target as HTMLElement;
            const updatedShips = this.playerGrid.ships().map(ship => {
                if (ship.id === draggedShip.getAttribute('data-ship-id')) {
                    ship.deployed = false;
                    ship.anchorSector = null;
                }
                return ship;
            });
            this.playerGrid.ships.set(updatedShips);
        }
    }

    private _clearPlaceholders(grid: HTMLElement) {
        // Unset placeholder styles
        const deployableShipPlaceholder = grid.querySelector('#deployable-ship-placeholder') as HTMLElement;
        if (deployableShipPlaceholder) {
            deployableShipPlaceholder.style.display = 'none';
            deployableShipPlaceholder.style.height = '';
            deployableShipPlaceholder.style.width = '';
        }

        // Reset sector states
        this.playerGrid.sectors.forEach(row => {
            row.forEach(sector => {
                if (sector.state.hasFlag(WarshipsSectorState.placeholder)) {
                    sector.state = WarshipsSectorState.empty;
                }
            });
        });
    }

    private _unlisten = (): void => {
        this._unlisteners.forEach(x => x());
        this._unlisteners = [];
    }
}
