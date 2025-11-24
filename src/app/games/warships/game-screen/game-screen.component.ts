import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, computed, inject, OnDestroy, OnInit, Renderer2, signal } from '@angular/core';
import { ConfirmDialogComponent } from '@components/confirm/confirm.component';
import { TooltipDirective, TooltipPosition } from "@directives/tooltip/tooltip.directive";
import { DialogSize } from '@models/dialog.model';
import { DialogService } from '@services/dialog.service';
import { EffectsService } from '@services/effects.service';
import { NewsflashService } from '@services/newsflash.service';
import { timer } from 'rxjs';
import { take } from 'rxjs/operators';
import { WarshipsFleetStatusComponent } from "../fleet-status/fleet-status.component";
import { ShipNewsflashComponent } from '../ship-newsflash/ship-newsflash.component';
import { WarshipsManager } from '../warships-manager';
import { getCoordinates, tryShipDeploy } from '../warships.functions';
import { WarshipsCoord, WarshipsEvent, WarshipsEventType, WarshipsGameState, WarshipsGrid, WarshipsScreenState, WarshipsSector, WarshipsSectorState, WarshipsShip, WarshipsShipOrientation, WarshipsTurn } from '../warships.models';

@Component({
    selector: 'ak-warships-game-screen',
    styleUrls: ['./game-screen.component.scss'],
    templateUrl: './game-screen.component.html',
    imports: [
        CommonModule,
        NgOptimizedImage,
        TooltipDirective,
        WarshipsFleetStatusComponent,
    ]
})
export class WarshipsGameScreenComponent implements OnInit, OnDestroy {
    public gameManager = inject(WarshipsManager);

    public showPlaceholder = signal(false);
    public showEventLog = signal(true);
    public showDragShipsMessage = computed(() => {
        return this.gameManager.gameInstance.gameState() === WarshipsGameState.deploying && this.deployableShips().length === 5;
    });
    public gridSectors = computed(() => {
        return this.gameManager.gameInstance.gameState() === WarshipsGameState.deploying || this.gameManager.gameInstance.turn() === WarshipsTurn.computer
            ? this.gameManager.gameInstance.playerGrid.sectors
            : this.gameManager.gameInstance.computerGrid.sectors;
    });
    public deployableShips = computed(() => this.gameManager.gameInstance.playerGrid.ships().filter(ship => !ship.deployed));
    public deployedShips = computed(() => {
        return this.gameManager.gameInstance.gameState() === WarshipsGameState.deploying || this.gameManager.gameInstance.turn() === WarshipsTurn.computer
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
    public EventType = WarshipsEventType;
    public GameState = WarshipsGameState;
    public SectorState = WarshipsSectorState;
    public ShipOrientation = WarshipsShipOrientation;
    public TooltipPosition = TooltipPosition;
    public Turn = WarshipsTurn;

    private _dialogService = inject(DialogService);
    private _effectsService = inject(EffectsService);
    private _newsflashService = inject(NewsflashService);
    private _renderer = inject(Renderer2);

    private _playerHasShot = true;
    private _currentDragSector: { row: number, col: number } | null = null;
    private _unlisteners: (() => void)[] = [];

    private get _allPlayerShipsSunk(): boolean {
        return this.playerGrid.ships().every(ship => ship.health === 0);
    }
    private get _allComputerShipsSunk(): boolean {
        return this.computerGrid.ships().every(ship => ship.health === 0);
    }

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

    public testVictory(): void {
        this.gameManager.gameInstance.gameState.set(WarshipsGameState.victory);
        this.gameManager.gameInstance.computerGrid.ships().forEach(s => s.health = 0);
        this._showEndGameScreen();
    }

    public testNewsflash(): void {
        this._newsflashService.show(ShipNewsflashComponent, { ship: new WarshipsShip('Carrier', 5) });
    }

    public showSettingsDialog(): void {
        // TODO
    }

    public showHelpDialog(): void {
        // TODO
    }

    public quit(confirm = false): void {
        const doQuit = () => {
            this.gameManager.gameInstance = null;
            this.gameManager.screen.set(WarshipsScreenState.menu);
        };

        if (confirm) {
            const componentRef = this._dialogService.show(ConfirmDialogComponent, DialogSize.minimal, false);
            if (componentRef) {
                componentRef.title = 'Confirm Quit';
                componentRef.message = 'The game in progress will be lost. Are you sure you want to quit back to the menu screen?';
                componentRef.confirmText = 'Quit';
                componentRef.cancelText = 'Cancel';
                componentRef.confirm = () => {
                    this._dialogService.close();
                    doQuit();
                };
                componentRef.cancel = () => {
                    this._dialogService.close();
                };
            }
        } else {
            doQuit();
        }
    }

    // #region - Public Methods
    public shipDragStart = (event: DragEvent): void => {
        if (this.gameManager.gameInstance.gameState() !== WarshipsGameState.deploying) {
            return;
        }

        this.showPlaceholder.set(true);

        // Listen for dragend at document level to detect off-grid or off-screen drops
        this._unlisteners.push(this._renderer.listen(document, 'dragend', this._documentDragEnd));

        const ship = event.currentTarget as HTMLElement;
        const shipRect = ship.getBoundingClientRect();
        ship.id = 'dragged-ship';
        const length = ship.getAttribute('data-ship-length');

        // Set ship data
        const shipId = ship.getAttribute('data-ship-id');
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData('shipid', shipId);
        event.dataTransfer.setData('length', length);
        event.dataTransfer.setData('orientation', ship.getAttribute('data-ship-orientation'));

        if (ship.classList.contains('deployed-ship')) {
            // Set temporary styles for deployed ship to prevent it from blocking dragover events
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
                let r = deployedShip.anchorSector.row, c = deployedShip.anchorSector.col;
                if (deployedShip.orientation === WarshipsShipOrientation.horizontal) {
                    c += i;
                } else {
                    r += i;
                }

                this.playerGrid.sectors[r][c].state = WarshipsSectorState.empty;
                this.playerGrid.sectors[r][c].shipId = null;
            }
        }
    }

    public shipDragEnd = (event: DragEvent): void => {
        const ship = event.currentTarget as HTMLElement;
        ship.removeAttribute('id');
    }

    public sectorDragEnter = (event: DragEvent): void => {
        if (this.gameManager.gameInstance.gameState() === WarshipsGameState.deploying && event.dataTransfer.types.includes('shipid')) {
            // Sector data
            const sector = event.currentTarget as HTMLElement;
            const row = parseInt(sector.getAttribute('data-row'), 10);
            const col = parseInt(sector.getAttribute('data-col'), 10);

            // Track current hovered sector
            this._currentDragSector = { row, col };

            // Ship data
            const draggedShip = document.getElementById('dragged-ship');
            const length = parseInt(draggedShip.getAttribute('data-ship-length'), 10);
            const orientation = parseInt(draggedShip.getAttribute('data-ship-orientation'), 10);

            // Snap to the closest valid position
            const occupiedSectors = tryShipDeploy(row, col, length, orientation, this.playerGrid.sectors);
            if (occupiedSectors.length === 0) {
                // Invalid placement, do not show placeholder
                return;
            }

            // Mark sectors as occupied with ship
            occupiedSectors.forEach(s => {
                this.playerGrid.sectors[s.row][s.col].state = WarshipsSectorState.placeholder;
            });

            // Move placeholder to snapped anchor
            const deployableShipPlaceholder = sector.parentElement.querySelector('#deployable-ship-placeholder') as HTMLElement;
            deployableShipPlaceholder.style.display = 'block';
            deployableShipPlaceholder.style.height = '100%';
            deployableShipPlaceholder.style.width = '100%';
            const snappedAnchor = occupiedSectors[0];
            deployableShipPlaceholder.style.gridRowStart = (snappedAnchor.row + 1).toString();
            deployableShipPlaceholder.style.gridColumnStart = (snappedAnchor.col + 1).toString();
            if (orientation === WarshipsShipOrientation.horizontal) {
                deployableShipPlaceholder.style.gridRowEnd = 'span 1';
                deployableShipPlaceholder.style.gridColumnEnd = `span ${length}`;
            } else {
                deployableShipPlaceholder.style.gridRowEnd = `span ${length}`;
                deployableShipPlaceholder.style.gridColumnEnd = 'span 1';
            }
        }
    }

    public sectorDragOver = (event: DragEvent): void => {
        event.preventDefault();
        // Set move as the only allowed drop effect
        event.dataTransfer.dropEffect = 'move';
    }

    public sectorDragLeave = (event: DragEvent): void => {
        const sector = event.currentTarget as HTMLElement;
        const row = parseInt(sector.getAttribute('data-row'), 10);
        const col = parseInt(sector.getAttribute('data-col'), 10);

        // Only clear placeholders if currentDragSector has not been updated by dragstart, meaning the drag has left the grid entirely
        if (this._currentDragSector && this._currentDragSector.row === row && this._currentDragSector.col === col) {
            this._clearPlaceholders(sector.parentElement);
            this._currentDragSector = null;
        }
    }

    public sectorDrop = (event: DragEvent): void => {
        if (this.gameManager.gameInstance.gameState() !== WarshipsGameState.deploying) {
            return;
        }

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

        // Hide preivew
        const previewElement = document.querySelector('#deployable-ship-preview');
        if (previewElement) {
            this._renderer.addClass(previewElement, 'd-none');
        }

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
            this.playerGrid.sectors[s.row][s.col].state = WarshipsSectorState.ship;
            this.playerGrid.sectors[s.row][s.col].shipId = id;
        });

        // Use snapped anchor sector for ship placement
        const snappedAnchor = occupiedSectors[0];
        const updatedShips = this.playerGrid.ships().map(ship => {
            if (id === ship.id) {
                ship.deployed = true;
                ship.anchorSector = { row: snappedAnchor.row, col: snappedAnchor.col };
            }
            return ship;
        });
        this.playerGrid.ships.set(updatedShips);
    }

    // TODO - improve this so ships snap to the nearest valid spot
    public rotateShip(shipId: string) {
        if (this.gameManager.gameInstance.gameState() !== WarshipsGameState.deploying) {
            return;
        }

        const ship = this.playerGrid.ships().find(s => s.id === shipId);

        // Calculate new sectors (minus anchor sector)
        const newSectors: WarshipsCoord[] = [];
        for (let i = 1; i < ship.length; i++) {
            let r = ship.anchorSector.row, c = ship.anchorSector.col;
            if (ship.orientation === WarshipsShipOrientation.horizontal) {
                r += i;
            } else {
                c += i;
            }

            if (r > 9 || c > 9 || this.playerGrid.sectors[r][c].state.hasFlag(WarshipsSectorState.ship)) {
                // Out of bounds or overlaps another deployed ship, abort
                return;
            }
            newSectors.push({ row: r, col: c });
        }

        // Reset old sectors to empty (minus anchor sector)
        for (let i = 1; i < ship.length; i++) {
            let r = ship.anchorSector.row, c = ship.anchorSector.col;
            if (ship.orientation === WarshipsShipOrientation.horizontal) {
                c += i;
            } else {
                r += i;
            }

            this.playerGrid.sectors[r][c].state = WarshipsSectorState.empty;
        }

        // Update new sectors and ship data
        newSectors.forEach(s => {
            this.playerGrid.sectors[s.row][s.col].state = WarshipsSectorState.ship;
        });
        ship.orientation = ship.orientation === WarshipsShipOrientation.horizontal
            ? WarshipsShipOrientation.vertical
            : WarshipsShipOrientation.horizontal;
        this.playerGrid.ships.set([...this.playerGrid.ships()]);
    }

    public deploy(): void {
        this.deployRandomly(this.computerGrid);
        this.gameManager.gameInstance.gameState.set(WarshipsGameState.running);
        this.gameManager.gameInstance.turn.set(WarshipsTurn.player);
        this._logEvent(WarshipsEventType.state, 'Let the battle begin!');
    }

    public deployRandomly(grid: WarshipsGrid): void {
        // Reset sectors
        grid.sectors.forEach(row => row.forEach(sector => {
            sector.state = WarshipsSectorState.empty;
            sector.shipId = null;
        }));

        // Randomly deploy ships
        grid.ships().forEach(ship => {
            ship.deployed = false;
            while (!ship.deployed) {
                const row = Math.floor(Math.random() * 10);
                const col = Math.floor(Math.random() * 10);
                ship.orientation = Math.floor(Math.random() * 2) + 1;
                const occupiedSectors = tryShipDeploy(row, col, ship.length, ship.orientation, grid.sectors);

                if (occupiedSectors.length > 0) {
                    const snappedAnchor = occupiedSectors[0];
                    ship.deployed = true;
                    ship.anchorSector = { row: snappedAnchor.row, col: snappedAnchor.col };

                    // Mark sectors with ship
                    occupiedSectors.forEach(s => {
                        grid.sectors[s.row][s.col].state = WarshipsSectorState.ship;
                        grid.sectors[s.row][s.col].shipId = ship.id;
                    });
                }
            }
        });
        grid.ships.set([...grid.ships()]);
    }

    public sectorClick(row: number, col: number): void {
        const sector = this.computerGrid.sectors[row][col];

        if (this.gameManager.gameInstance.gameState() === WarshipsGameState.deploying
            || this.gameManager.gameInstance.turn() === WarshipsTurn.computer
            || sector.state.hasFlag(WarshipsSectorState.miss)
            || sector.state.hasFlag(WarshipsSectorState.hit)
            || !this._playerHasShot
        ) {
            return;
        }

        this._playerHasShot = false;
        this._fireAt(row, col);
    }
    // #endregion

    // #region - Private Methods
    private _documentDragEnd = (event: DragEvent): void => {
        this._unlisten();

        // Double check if preview still needs to be hidden
        const previewElement = document.querySelector('#deployable-ship-preview');
        if (previewElement) {
            this._renderer.addClass(previewElement, 'd-none');
        }

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

    private _logEvent(type: WarshipsEventType, message: string): void {
        this.gameManager.gameInstance.eventLog.push(new WarshipsEvent(type, message));

        // Short delay to allow event log template changes to propagate
        timer(10).pipe(take(1)).subscribe(() => {
            // Check if event log container needs to be scrolled to show latest message
            const eventLogContainer = document.querySelector('#event-log-container');
            const eventLog = document.querySelector('#event-log');
            if (eventLog && (eventLog.clientHeight > eventLogContainer.clientHeight)) {
                eventLog.children[eventLog.children.length - 1].scrollIntoView();
            }
        });
    }

    private _pickNextTargetedSector(grid: WarshipsGrid): WarshipsCoord {
        // Find hit sectors on weakened ships
        const weakenedHits: WarshipsCoord[] = [];
        for (let r = 0; r < grid.sectors.length; r++) {
            for (let c = 0; c < grid.sectors[r].length; c++) {
                const sector = grid.sectors[r][c];
                if (sector.state.hasFlag(WarshipsSectorState.hit)) {
                    const ship = grid.ships().find(s => s.id === sector.shipId);
                    if (ship?.health > 0) {
                        weakenedHits.push({ row: r, col: c });
                    }
                }
            }
        }

        // Collect untargeted adjacent sectors
        const adjacentSectors: WarshipsCoord[] = [];
        const directions = [
            { dr: -1, dc: 0 },  // up
            { dr: 1, dc: 0 },   // down
            { dr: 0, dc: -1 },  // left
            { dr: 0, dc: 1 }    // right
        ];
        for (const hit of weakenedHits) {
            for (const { dr, dc } of directions) {
                const nr = hit.row + dr, nc = hit.col + dc;
                if (nr >= 0 && nr < 10 && nc >= 0 && nc < 10
                    && !grid.sectors[nr][nc].state.hasFlag(WarshipsSectorState.miss)
                    && !grid.sectors[nr][nc].state.hasFlag(WarshipsSectorState.hit)
                    && !adjacentSectors.some(s => s.row === nr && s.col === nc)
                ) {
                    adjacentSectors.push({ row: nr, col: nc });
                }
            }
        }

        // Target viable adjacent sectors first
        if (adjacentSectors.length > 0) {
            return adjacentSectors[Math.floor(Math.random() * adjacentSectors.length)];
        }

        // Fallback to a random untargeted sector
        const untargetedSectors: WarshipsCoord[] = [];
        for (let r = 0; r < grid.sectors.length; r++) {
            for (let c = 0; c < grid.sectors[r].length; c++) {
                const state = grid.sectors[r][c].state;
                if (!state.hasFlag(WarshipsSectorState.miss) && !state.hasFlag(WarshipsSectorState.hit)) {
                    untargetedSectors.push({ row: r, col: c });
                }
            }
        }

        return untargetedSectors.length > 0
            ? untargetedSectors[Math.floor(Math.random() * untargetedSectors.length)]
            : null;
    }

    private _computerTurn(): void {
        timer(1000).pipe(take(1)).subscribe(() => {
            const coords = this._pickNextTargetedSector(this.playerGrid);
            this._fireAt(coords.row, coords.col);
        });
    }

    private _fireAt(row: number, col: number): void {
        let grid: WarshipsGrid, actor: string, victim: string;
        if (this.gameManager.gameInstance.turn() === WarshipsTurn.player) {
            grid = this.computerGrid;
            actor = 'You';
            victim = 'the opponent';
        } else {
            grid = this.playerGrid;
            actor = 'Opponent';
            victim = 'your';
        }
        const targetedSector = grid.sectors[row][col];
        const coords = getCoordinates(row, col);

        // Show crosshairs over targeted sector
        const sectorOverlayEl = document.querySelector(`.sector-overlay[data-row="${row}"][data-col="${col}"]`);
        const sectorOverlayElBox = sectorOverlayEl.getBoundingClientRect();
        this._showCrosshairs(sectorOverlayEl);

        // Spin crosshairs for 1s
        timer(1000).pipe(take(1)).subscribe(() => {
            this._hideCrosshairs();

            if (targetedSector.state.hasFlag(WarshipsSectorState.empty)) {
                // Miss
                this._logEvent(WarshipsEventType.miss, `${actor} fired at ${coords}`);
                this._effectsService.splash(sectorOverlayElBox.x + (sectorOverlayElBox.width / 2), sectorOverlayElBox.y + (sectorOverlayElBox.height / 2));

                // Splash effect plays for 1.25s
                timer(1250).pipe(take(1)).subscribe(() => {
                    targetedSector.state = targetedSector.state.toggleFlag(WarshipsSectorState.miss);

                    // Let player see miss marker for 1s, then continue to next turn
                    timer(1000).pipe(take(1)).subscribe(() => {
                        if (this.gameManager.gameInstance.turn() === WarshipsTurn.player) {
                            this.gameManager.gameInstance.turn.set(WarshipsTurn.computer);
                            this._computerTurn();
                        } else {
                            this._playerHasShot = true;
                            this.gameManager.gameInstance.turn.set(WarshipsTurn.player);
                        }
                    });
                });
            } else if (targetedSector.state.hasFlag(WarshipsSectorState.ship)) {
                // Hit
                this._logEvent(WarshipsEventType.hit, `${actor} fired at ${coords}`);
                this._effectsService.explosion(sectorOverlayElBox.x + (sectorOverlayElBox.width / 2), sectorOverlayElBox.y + (sectorOverlayElBox.height / 2));

                // Explosion effect plays for 1.25s
                timer(1250).pipe(take(1)).subscribe(async () => {
                    targetedSector.state = targetedSector.state.toggleFlag(WarshipsSectorState.hit);

                    // Update ship health and check if it sank
                    const ship = grid.ships().find(s => s.id === targetedSector.shipId);
                    // TODO - possible bug not finding ship
                    ship.health--;
                    if (ship.health === 0) {
                        await this._newsflashService.show(ShipNewsflashComponent, { ship }).finally(() => {
                            this._logEvent(WarshipsEventType.sink, `${actor} sank ${victim} ${ship.name}`);
                        });
                    }

                    if (this.gameManager.gameInstance.turn() === WarshipsTurn.player) {
                        if (this._allComputerShipsSunk) {
                            this.gameManager.gameInstance.gameState.set(WarshipsGameState.victory);
                            this._showEndGameScreen();
                        } else {
                            this._playerHasShot = true;
                        }
                    } else {
                        if (this._allPlayerShipsSunk) {
                            this.gameManager.gameInstance.gameState.set(WarshipsGameState.defeat);
                            this._showEndGameScreen();
                        } else {
                            this._computerTurn();
                        }
                    }
                });
            }
        });
    }

    private _showCrosshairs(sectorOverlayEl: Element): void {
        const crosshairEl = document.querySelector('#crosshairs');
        crosshairEl.parentNode.removeChild(crosshairEl);
        sectorOverlayEl.appendChild(crosshairEl);
        this._renderer.setStyle(crosshairEl, 'display', 'block');
    }

    private _hideCrosshairs(): void {
        const crosshairEl = document.querySelector('#crosshairs');
        crosshairEl.parentElement.removeChild(crosshairEl);
        document.querySelector('#sector-overlays').appendChild(crosshairEl);
        this._renderer.setStyle(crosshairEl, 'display', 'none');
    }

    private _showEndGameScreen(): void {
        this.gameManager.screen.set(WarshipsScreenState.end);
    }

    private _unlisten = (): void => {
        this._unlisteners.forEach(x => x());
        this._unlisteners = [];
    }
    // #endregion
}
