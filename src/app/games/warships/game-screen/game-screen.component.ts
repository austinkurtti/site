import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, computed, ElementRef, inject, OnDestroy, OnInit, Renderer2, signal, viewChildren } from '@angular/core';
import { ConfirmDialogComponent } from '@components/confirm/confirm.component';
import { MenuContentDirective } from '@directives/menu/menu-content.directive';
import { MenuDirective, MenuPosition } from '@directives/menu/menu.directive';
import { TooltipPosition } from "@directives/tooltip/tooltip.directive";
import { DialogSize } from '@models/dialog.model';
import { DialogService } from '@services/dialog.service';
import { EffectsService } from '@services/effects.service';
import { NewsflashService } from '@services/newsflash.service';
import { BehaviorSubject, timer } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { WarshipsFleetStatusComponent } from "../fleet-status/fleet-status.component";
import { WarshipsNewsflashComponent, WarshipsNewsflashType } from '../ship-newsflash/warships-newsflash.component';
import { WarshipsManager } from '../warships-manager';
import { getCoordinates, tryShipDeploy } from '../warships.functions';
import { WarshipsEvent, WarshipsEventType, WarshipsGameState, WarshipsGrid, WarshipsScreenState, WarshipsSector, WarshipsSectorState, WarshipsShipOrientation, WarshipsTurn } from '../warships.models';

@Component({
    selector: 'ak-warships-game-screen',
    styleUrl: './game-screen.component.scss',
    templateUrl: './game-screen.component.html',
    imports: [
        CommonModule,
        MenuContentDirective,
        MenuDirective,
        NgOptimizedImage,
        WarshipsFleetStatusComponent
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

    public scrollableEventLogs = viewChildren<ElementRef<HTMLElement>>('scrollableEventLog');

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
    public MenuPosition = MenuPosition;
    public SectorState = WarshipsSectorState;
    public ShipOrientation = WarshipsShipOrientation;
    public TooltipPosition = TooltipPosition;
    public Turn = WarshipsTurn;

    private _dialogService = inject(DialogService);
    private _effectsService = inject(EffectsService);
    private _newsflashService = inject(NewsflashService);
    private _renderer = inject(Renderer2);

    private _playerHasShot = false;
    private _currentDragSector: { row: number, col: number } | null = null;
    private _unlisteners: (() => void)[] = [];

    // Touch drag state
    private _touchDraggingShip: HTMLElement | null = null;
    private _touchDraggingShipId: string | null = null;
    private _touchDraggingShipLength: number | null = null;
    private _touchDraggingShipOrientation: number | null = null;
    private _touchLastSector: { row: number, col: number } | null = null;
    private _touchStartX: number | null = null;
    private _touchStartY: number | null = null;
    private _touchMoved: boolean = false;
    private _touchRotateWindowOpen = false;
    private _touchRotateExpired = new BehaviorSubject<boolean>(false);

    private get _allPlayerShipsSunk(): boolean {
        return this.playerGrid.ships().every(ship => ship.health === 0);
    }
    private get _allComputerShipsSunk(): boolean {
        return this.computerGrid.ships().every(ship => ship.health === 0);
    }

    public ngOnInit(): void {
        this.playerGrid.sectors = new Array(10).fill([]);
        for (let i = 0; i < 10; i++) {
            this.playerGrid.sectors[i] = Array.from({ length: 10 }, (v, j) => new WarshipsSector(i, j));
        }
        this.computerGrid.sectors = new Array(10).fill([]);
        for (let i = 0; i < 10; i++) {
            this.computerGrid.sectors[i] = Array.from({ length: 10 }, (v, j) => new WarshipsSector(i, j));
        }
    }

    public ngOnDestroy(): void {
        this._unlisten();
        this._expireTouchRotateTimer();
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
                componentRef.confirmClass = 'cancel-button';
                componentRef.cancelText = 'Cancel';
                componentRef.cancelClass = '';
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

    // #region - Drag Methods
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

            // Mark sectors with placeholder
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
            this._clearPlaceholders();
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
        const row = parseInt(sector.getAttribute('data-row'), 10);
        const col = parseInt(sector.getAttribute('data-col'), 10);

        // Ship data
        const draggedShip = document.getElementById('dragged-ship');
        const id = event.dataTransfer.getData('shipid');
        const length = parseInt(event.dataTransfer.getData('length'), 10);
        const orientation = parseInt(event.dataTransfer.getData('orientation'), 10);

        // Clear placeholders
        this._clearPlaceholders();

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

        // TODO - is this even necessary? could just track the success of tryShipDeploy in sectorDragEnter
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

    // #region - Touch Methods
    public shipTouchStart = (event: TouchEvent): void => {
        if (this.gameManager.gameInstance.gameState() !== WarshipsGameState.deploying) {
            return;
        }

        event.preventDefault();

        const shipEl = event.currentTarget as HTMLElement;
        shipEl.id = 'dragged-ship';
        this._touchDraggingShip = shipEl;
        this._touchDraggingShipId = shipEl.getAttribute('data-ship-id');
        this._touchDraggingShipLength = parseInt(shipEl.getAttribute('data-ship-length'), 10);
        this._touchDraggingShipOrientation = parseInt(shipEl.getAttribute('data-ship-orientation'), 10);
        this._touchMoved = false;

        const touch = event.touches[0];
        this._touchStartX = touch.clientX;
        this._touchStartY = touch.clientY;

        // Set a short timeout to allow for tap-to-rotate (if no move occurs)
        this._touchRotateWindowOpen = true;
        this._touchRotateExpired.next(false);
        timer(250).pipe(takeUntil(this._touchRotateExpired)).subscribe(() => this._touchRotateWindowOpen = false);
    }

    public shipTouchMove = (event: TouchEvent): void => {
        if (!this._touchDraggingShip) {
            return;
        }

        const touch = event.touches[0];
        // Only start drag if moved enough (threshold: 10px)
        if (!this._touchMoved && this._touchStartX !== null && this._touchStartY !== null) {
            const dx = touch.clientX - this._touchStartX;
            const dy = touch.clientY - this._touchStartY;
            if (Math.abs(dx) > 10 || Math.abs(dy) > 10) {
                this._touchMoved = true;
                // Expire rotate timer if user starts dragging
                if (this._touchRotateWindowOpen) {
                    this._expireTouchRotateTimer();
                }

                this.showPlaceholder.set(true);

                if (this._touchDraggingShip.classList.contains('deployed-ship')) {
                    const shipRect = this._touchDraggingShip.getBoundingClientRect();

                    // Set temporary styles for deployed ship to prevent it from blocking dragover events
                    this._touchDraggingShip.style.border = 'none';
                    this._touchDraggingShip.style.height = `${shipRect.height}px`;
                    this._touchDraggingShip.style.width = `${shipRect.width}px`;
                    this._touchDraggingShip.style.position = 'absolute';
                    this._touchDraggingShip.style.pointerEvents = 'none';

                    // Short delay for invisibility to allow browser to capture the element for dragging before it disappears
                    timer(10).pipe(take(1)).subscribe(() => {
                        this._touchDraggingShip.style.visibility = 'hidden';
                    });

                    // Reset sectors containing deployed ship
                    const deployedShip = this.playerGrid.ships().find(s => s.id === this._touchDraggingShipId);
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
        }

        if (!this._touchMoved) {
            return;
        }

        // Look for a sector under the touch point
        const elementsAtPoint = document.elementsFromPoint(touch.clientX, touch.clientY);
        const sectorEl = elementsAtPoint.find(el => el.classList.contains('sector'));

        if (sectorEl) {
            const row = parseInt(sectorEl.getAttribute('data-row'), 10);
            const col = parseInt(sectorEl.getAttribute('data-col'), 10);

            // Only update if sector changed
            if (!this._touchLastSector || this._touchLastSector.row !== row || this._touchLastSector.col !== col) {
                this._touchLastSector = { row, col };
                // Clear previous placeholders
                this._clearPlaceholders();

                // Snap to closest valid position
                const occupiedSectors = tryShipDeploy(
                    row,
                    col,
                    this._touchDraggingShipLength,
                    this._touchDraggingShipOrientation,
                    this.playerGrid.sectors
                );
                if (occupiedSectors.length === 0) {
                    // Invalid placement, do not show placeholder
                    return;
                }

                // Mark sectors with placeholder
                occupiedSectors.forEach(s => {
                    this.playerGrid.sectors[s.row][s.col].state = WarshipsSectorState.placeholder;
                });

                // Move placeholder to snapped anchor
                const deployableShipPlaceholder = document.querySelector('#deployable-ship-placeholder') as HTMLElement;
                if (deployableShipPlaceholder) {
                    deployableShipPlaceholder.style.display = 'block';
                    deployableShipPlaceholder.style.height = '100%';
                    deployableShipPlaceholder.style.width = '100%';
                    const snappedAnchor = occupiedSectors[0];
                    deployableShipPlaceholder.style.gridRowStart = (snappedAnchor.row + 1).toString();
                    deployableShipPlaceholder.style.gridColumnStart = (snappedAnchor.col + 1).toString();
                    if (this._touchDraggingShipOrientation === WarshipsShipOrientation.horizontal) {
                        deployableShipPlaceholder.style.gridRowEnd = 'span 1';
                        deployableShipPlaceholder.style.gridColumnEnd = `span ${this._touchDraggingShipLength}`;
                    } else {
                        deployableShipPlaceholder.style.gridRowEnd = `span ${this._touchDraggingShipLength}`;
                        deployableShipPlaceholder.style.gridColumnEnd = 'span 1';
                    }
                }
            }
        } else {
            // Not over a sector, clear placeholders
            this._clearPlaceholders();
            this._touchLastSector = null;
        }
    }

    public shipTouchEnd = (event: TouchEvent): void => {
        if (!this._touchDraggingShip) {
            return;
        }

        // If user did NOT move, treat as tap-to-rotate for deployed ships
        if (!this._touchMoved && this._touchDraggingShip.classList.contains('deployed-ship')) {
            // Cancel drag state
            if (this._touchRotateWindowOpen) {
                this._expireTouchRotateTimer();
            }

            // Rotate the ship
            this.rotateShip(this._touchDraggingShipId);

            // Reset state
            this._touchDraggingShip.removeAttribute('id');
            this._touchDraggingShip = null;
            this._touchDraggingShipId = null;
            this._touchDraggingShipLength = null;
            this._touchDraggingShipOrientation = null;
            this._touchLastSector = null;
            this._touchStartX = null;
            this._touchStartY = null;
            this._touchMoved = false;
            return;
        }

        // Look for a sector under the last touch point
        let touch: Touch | null = null;
        if (event.changedTouches && event.changedTouches.length > 0) {
            touch = event.changedTouches[0];
        } else if (event.touches && event.touches.length > 0) {
            touch = event.touches[0];
        }
        const elementsAtPoint = document.elementsFromPoint(touch.clientX, touch.clientY);
        const sectorEl = elementsAtPoint.find(el => el.classList.contains('sector'));

        if (
            sectorEl &&
            this._touchDraggingShipId &&
            this._touchDraggingShipLength &&
            this._touchDraggingShipOrientation !== null
        ) {
            const row = parseInt(sectorEl.getAttribute('data-row'), 10);
            const col = parseInt(sectorEl.getAttribute('data-col'), 10);

            // Attempt deployment
            const occupiedSectors = tryShipDeploy(
                row,
                col,
                this._touchDraggingShipLength,
                this._touchDraggingShipOrientation,
                this.playerGrid.sectors
            );
            if (occupiedSectors.length > 0) {
                // Place ship in all occupied sectors
                occupiedSectors.forEach(s => {
                    this.playerGrid.sectors[s.row][s.col].state = WarshipsSectorState.ship;
                    this.playerGrid.sectors[s.row][s.col].shipId = this._touchDraggingShipId;
                });

                // Use snapped anchor sector for ship placement
                const snappedAnchor = occupiedSectors[0];
                const updatedShips = this.playerGrid.ships().map(ship => {
                    if (this._touchDraggingShipId === ship.id) {
                        ship.deployed = true;
                        ship.anchorSector = { row: snappedAnchor.row, col: snappedAnchor.col };
                    }
                    return ship;
                });
                this.playerGrid.ships.set(updatedShips);
            }
        } else if (this._touchDraggingShipId) {
            // Not dropped on a sector, reset ship to undeployed
            const updatedShips = this.playerGrid.ships().map(ship => {
                if (ship.id === this._touchDraggingShipId) {
                    ship.deployed = false;
                    ship.anchorSector = null;
                }
                return ship;
            });
            this.playerGrid.ships.set(updatedShips);
        }

        // Unset temporary styles
        const draggedShip = document.getElementById('dragged-ship');
        if (draggedShip) {
            draggedShip.style.border = '';
            draggedShip.style.height = '';
            draggedShip.style.width = '';
            draggedShip.style.position = '';
            draggedShip.style.visibility = '';
            draggedShip.style.pointerEvents = '';
            draggedShip.removeAttribute('id');
        }

        this.showPlaceholder.set(false);
        this._clearPlaceholders();
        this._touchDraggingShip = null;
        this._touchDraggingShipId = null;
        this._touchDraggingShipLength = null;
        this._touchDraggingShipOrientation = null;
        this._touchLastSector = null;
        this._touchStartX = null;
        this._touchStartY = null;
        this._touchMoved = false;
        if (this._touchRotateWindowOpen) {
            this._expireTouchRotateTimer();
        }
    }
    // #endregion

    // #region - Misc. Public Methods
    public rotateShip(shipId: string) {
        if (this.gameManager.gameInstance.gameState() !== WarshipsGameState.deploying) {
            return;
        }

        const ship = this.playerGrid.ships().find(s => s.id === shipId);

        // Clear current sectors to empty so tryShipDeploy doesn't get confused
        for (let i = 0; i < ship.length; i++) {
            let r = ship.anchorSector.row, c = ship.anchorSector.col;
            if (ship.orientation === WarshipsShipOrientation.horizontal) {
                c += i;
            } else {
                r += i;
            }

            this.playerGrid.sectors[r][c].state = WarshipsSectorState.empty;
            this.playerGrid.sectors[r][c].shipId = null;
        }

        // Attempt deployment with new orientation
        const newOrientation = ship.orientation === WarshipsShipOrientation.horizontal
            ? WarshipsShipOrientation.vertical
            : WarshipsShipOrientation.horizontal;
        const newSectors = tryShipDeploy(ship.anchorSector.row, ship.anchorSector.col, ship.length, newOrientation, this.playerGrid.sectors);
        if (newSectors.length === 0) {
            // About - deploy failed
            // Restore original sectors
            for (let i = 0; i < ship.length; i++) {
                let r = ship.anchorSector.row, c = ship.anchorSector.col;
                if (ship.orientation === WarshipsShipOrientation.horizontal) {
                    c += i;
                } else {
                    r += i;
                }

                this.playerGrid.sectors[r][c].state = WarshipsSectorState.ship;
                this.playerGrid.sectors[r][c].shipId = ship.id;
            }
        } else {
            // Update new sectors and ship data
            newSectors.forEach(s => {
                this.playerGrid.sectors[s.row][s.col].state = WarshipsSectorState.ship;
                this.playerGrid.sectors[s.row][s.col].shipId = ship.id;
            });
            const snappedAnchor = newSectors[0];
            ship.anchorSector = { row: snappedAnchor.row, col: snappedAnchor.col };
            ship.orientation = newOrientation;
            this.playerGrid.ships.set([...this.playerGrid.ships()]);
        }
    }

    public async start(): Promise<void> {
        this.deployRandomly(this.computerGrid);
        this.gameManager.gameInstance.gameState.set(WarshipsGameState.running);
        this.gameManager.gameInstance.turn.set(WarshipsTurn.player);

        const newsflashInputs = {
            type: WarshipsNewsflashType.core,
            message: 'Let the battle begin!'
        };
        const finishDeployment = () => {
            this._logEvent(WarshipsEventType.state, newsflashInputs.message);
            this._playerHasShot = true;
        };

        if (this.gameManager.gameSettings.playEffects) {
            await this._newsflashService.show(WarshipsNewsflashComponent, newsflashInputs).finally(() => {
                finishDeployment();
            });
        } else {
            finishDeployment();
        }

        return Promise.resolve(void 0);
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

    public scrollEventLogs(): void {
        const scrollableEventLogs = this.scrollableEventLogs();
        if (scrollableEventLogs.length > 0) {
            scrollableEventLogs.forEach(elc => elc.nativeElement.scrollTop = elc.nativeElement.scrollHeight);
        }
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

    private _clearPlaceholders() {
        // Unset placeholder styles
        const deployableShipPlaceholder = document.querySelector('#deployable-ship-placeholder') as HTMLElement;
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
            this.scrollEventLogs();
        });
    }

    private _computerTurn(): void {
        // Delay computer's shot by 1s to avoid sudden game state changes and simulate "thinking" about where to shoot
        timer(1000).pipe(take(1)).subscribe(() => {
            const coords = this.gameManager.computerSelectNextSector();
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
        timer(1000).pipe(take(1)).subscribe(async () => {
            this._hideCrosshairs();

            if (targetedSector.state.hasFlag(WarshipsSectorState.empty)) {
                // Miss
                this._logEvent(WarshipsEventType.miss, `${actor} fired at ${coords}`);
                if (this.gameManager.gameSettings.playEffects) {
                    await this._effectsService.ripple(sectorOverlayElBox.x + (sectorOverlayElBox.width / 2), sectorOverlayElBox.y + (sectorOverlayElBox.height / 2));
                }

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
            } else if (targetedSector.state.hasFlag(WarshipsSectorState.ship)) {
                // Hit
                this._logEvent(WarshipsEventType.hit, `${actor} fired at ${coords}`);
                if (this.gameManager.gameSettings.playEffects) {
                    await this._effectsService.explosion(sectorOverlayElBox.x + (sectorOverlayElBox.width / 2), sectorOverlayElBox.y + (sectorOverlayElBox.height / 2));
                }

                targetedSector.state = targetedSector.state.toggleFlag(WarshipsSectorState.hit);

                // Update ship health and check if it sank
                const ship = grid.ships().find(s => s.id === targetedSector.shipId);
                ship.health--;
                if (ship.health === 0) {
                    const newsflashInputs = {
                        type: WarshipsNewsflashType.shipSank,
                        message: `${ship.name} sank!`
                    };
                    const logSink = () => this._logEvent(WarshipsEventType.sink, `${actor} sank ${victim} ${ship.name}`);
                    if (this.gameManager.gameSettings.playEffects) {
                        await this._newsflashService.show(WarshipsNewsflashComponent, newsflashInputs).finally(() => {
                            logSink();
                        });
                    } else {
                        logSink();
                    }
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

    private _expireTouchRotateTimer(): void {
        this._touchRotateExpired.next(false);
    }
    // #endregion
}
