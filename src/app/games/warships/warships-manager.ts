import { inject, Injectable, Injector, signal } from '@angular/core';
import { getRandomInteger } from '@functions/rng';
import { DialogSize } from '@models/dialog.model';
import { DialogService } from '@services/dialog.service';
import { LocalStorageService } from '@services/local-storage.service';
import { WarshipsHelpDialogComponent } from './help-dialog/help-dialog.component';
import { WarshipsSettingsDialogComponent } from './settings-dialog/settings-dialog.component';
import { WarshipsCoords, WarshipsDifficulty, WarshipsEventType, WarshipsGameInstance, WarshipsGameSettings, WarshipsScreenState, WarshipsSector, WarshipsSectorState } from './warships.models';

@Injectable()
export class WarshipsManager {
    public readonly localStoragePrefix = 'warships';

    public screen = signal(WarshipsScreenState.menu);

    public gameInstance: WarshipsGameInstance;
    public gameSettings = new WarshipsGameSettings();

    private _dialogService = inject(DialogService);
    private _injector = inject(Injector);

    private get _untargetedPlayerSectors(): WarshipsSector[] {
        const untargetedSectors: WarshipsSector[] = [];
        for (let r = 0; r < this.gameInstance.playerGrid.sectors.length; r++) {
            for (let c = 0; c < this.gameInstance.playerGrid.sectors[r].length; c++) {
                const state = this.gameInstance.playerGrid.sectors[r][c].state;
                if (!state.hasFlag(WarshipsSectorState.miss) && !state.hasFlag(WarshipsSectorState.hit)) {
                    untargetedSectors.push(this.gameInstance.playerGrid.sectors[r][c]);
                }
            }
        }
        return untargetedSectors;
    }

    public initialize(): void {
        this.gameSettings.playEffects = LocalStorageService.getItem(`${this.localStoragePrefix}_playEffects`) ?? true;
    }

    public newGame(difficulty: WarshipsDifficulty): void {
        this.gameInstance = new WarshipsGameInstance();
        this.gameInstance.difficulty = difficulty;
        this.screen.set(WarshipsScreenState.game);
    }

    public showSettingsDialog(): void {
        this._dialogService.show(WarshipsSettingsDialogComponent, DialogSize.small, true, this._injector);
    }

    public showHelpDialog(): void {
        this._dialogService.show(WarshipsHelpDialogComponent, DialogSize.small);
    }

    public computerSelectNextSector(): WarshipsCoords {
        let targetSectorCoords: WarshipsCoords;

        // Find sectors containing weakened ships
        const weakenedHits: WarshipsCoords[] = [];
        // TODO - improve this to search only sectors containing ships, not every sector in the grid
        for (let r = 0; r < this.gameInstance.playerGrid.sectors.length; r++) {
            for (let c = 0; c < this.gameInstance.playerGrid.sectors[r].length; c++) {
                const sector = this.gameInstance.playerGrid.sectors[r][c];
                if (sector.state.hasFlag(WarshipsSectorState.hit)) {
                    const ship = this.gameInstance.playerGrid.ships().find(s => s.id === sector.shipId);
                    if (ship?.health > 0) {
                        weakenedHits.push({ row: r, col: c });
                    }
                }
            }
        }

        if (weakenedHits.length > 0) {
            // Find a sector to shoot at near weakend ship(s)
            const adjacentSectorCoords = this._getWeakenedShipAdjacentSectorCoords(weakenedHits);
            targetSectorCoords = adjacentSectorCoords[Math.floor(Math.random() * adjacentSectorCoords.length)];
        } else {
            let untargetedSectors = this._untargetedPlayerSectors;
            const mostRecentEventIsSink = this.gameInstance.eventLog[this.gameInstance.eventLog.length - 1].type === WarshipsEventType.sink;
            const hasFewerShips = this.gameInstance.computerGrid.ships().filter(s => s.health === 0) > this.gameInstance.playerGrid.ships().filter(s => s.health === 0);

            // Balancing will likely be an ongoing effort...
            switch (this.gameInstance.difficulty) {
                case WarshipsDifficulty.recruit:
                    // Disallow chained ship hits
                    if (mostRecentEventIsSink) {
                        untargetedSectors = this._filterOutOccupiedSectors(untargetedSectors);
                    } else if (hasFewerShips
                        ? Math.floor(Math.random() * 2) < 1 // ~50% chance to auto-miss when tied with or behind player
                        : Math.floor(Math.random() * 10) < 7 // ~70% chance to auto-miss when leading player
                    ) {
                        untargetedSectors = this._filterOutOccupiedSectors(untargetedSectors);
                    }
                    break;
                case WarshipsDifficulty.midshipman:
                    // Disallow chained ship hits
                    if (mostRecentEventIsSink) {
                        untargetedSectors = this._filterOutOccupiedSectors(untargetedSectors);
                    }
                    break;
                case WarshipsDifficulty.captain:
                    // Only shoot at sectors that could possibly contain a ship
                    untargetedSectors = untargetedSectors.filter(s => this._canAnyShipFitAt(s.coords.row, s.coords.col));
                    break;
                case WarshipsDifficulty.fleetAdmiral:
                    // Fleet Admiral does not like falling behind
                    if (hasFewerShips) {
                        // ~80% desperation attempt to catch up when on last ship
                        if (this.gameInstance.computerGrid.ships().filter(s => s.health === 0).length === 4 && getRandomInteger(1, 10) < 8) {
                            untargetedSectors = this._filterOutUnoccupiedSectors(untargetedSectors);
                            break;
                        }

                        // ~50% chance of retribution if not on last ship
                        if (Math.floor(Math.random() * 2) < 1) {
                            untargetedSectors = this._filterOutUnoccupiedSectors(untargetedSectors);
                            break;
                        }
                    }

                    // ~30% chance to chain another hit after sinking a ship
                    if (mostRecentEventIsSink && getRandomInteger(1, 10) < 4) {
                        untargetedSectors = this._filterOutUnoccupiedSectors(untargetedSectors);
                        break;
                    }
                    
                    // Only shoot at sectors that could possibly contain a ship
                    untargetedSectors = untargetedSectors.filter(s => this._canAnyShipFitAt(s.coords.row, s.coords.col));

                    // Remove the farthest sectors from any ship
                    if (untargetedSectors.length > 10) {
                        const occupiedSectors: WarshipsCoords[] = [];
                        for (let r = 0; r < this.gameInstance.playerGrid.sectors.length; r++) {
                            for (let c = 0; c < this.gameInstance.playerGrid.sectors[r].length; c++) {
                                const sector = this.gameInstance.playerGrid.sectors[r][c];
                                if (sector.state.hasFlag(WarshipsSectorState.ship) && !sector.state.hasFlag(WarshipsSectorState.hit)) {
                                    occupiedSectors.push({ row: r, col: c });
                                }
                            }
                        }

                        // Compute min Manhattan distance to any ship sector for each untargeted sector
                        const sorted = untargetedSectors
                            .map(s => {
                                let minDist = Infinity;
                                for (const sector of occupiedSectors) {
                                    const dist = Math.abs(s.coords.row - sector.row) + Math.abs(s.coords.col - sector.col);
                                    if (dist < minDist) {
                                        minDist = dist;
                                    }
                                }
                                return { sector: s, minDist };
                            })
                            .sort((a, b) => a.minDist - b.minDist);

                        // Keep closest 80%
                        untargetedSectors = sorted
                            .slice(0, Math.ceil(untargetedSectors.length * .8))
                            .map(obj => obj.sector);
                    }
                    break;
            }

            targetSectorCoords = untargetedSectors[Math.floor(Math.random() * untargetedSectors.length)].coords;
        }

        return targetSectorCoords;
    }

    private _getWeakenedShipAdjacentSectorCoords(weakenedHits: WarshipsCoords[]): WarshipsCoords[] {
        const adjacentSectors: WarshipsCoords[] = [];
        const tryPatternCheck = weakenedHits.length > 1 && this.gameInstance.difficulty !== WarshipsDifficulty.recruit;
        const untargetedSectors = this._untargetedPlayerSectors;
        const canTarget = (r: number, c: number) => untargetedSectors.find(s => s.coords.row === r && s.coords.col === c) !== undefined;

        // Disallow Recruit from trying pattern check
        if (tryPatternCheck) {
            // Check for a hit pattern that should be continued in the same row or col
            const sorted = [...weakenedHits].sort((a, b) => a.row - b.row || a.col - b.col);
            const sameRow = sorted.every(hit => hit.row === sorted[0].row);
            const sameCol = sorted.every(hit => hit.col === sorted[0].col);

            if (sameRow) {
                const row = sorted[0].row;
                const leftCol = sorted[0].col - 1;
                if (leftCol >= 0 && canTarget(row, leftCol)) {
                    adjacentSectors.push({ row, col: leftCol });
                }
                const rightCol = sorted[sorted.length - 1].col + 1;
                if (rightCol <= 9 && canTarget(row, rightCol)) {
                    adjacentSectors.push({ row, col: rightCol });
                }
            } else if (sameCol) {
                const col = sorted[0].col;
                const aboveRow = sorted[0].row - 1;
                if (aboveRow >= 0 && canTarget(aboveRow, col)) {
                    adjacentSectors.push({ row: aboveRow, col });
                }
                const belowRow = sorted[sorted.length - 1].row + 1;
                if (belowRow <= 9 && canTarget(belowRow, col)) {
                    adjacentSectors.push({ row: belowRow, col });
                }
            }
        }
        
        // Recruit always randomly selects, but non-Recruit also randomly selects if no valid pattern-matched sectors were found
        if (!tryPatternCheck || adjacentSectors.length === 0) {
            // No hit pattern, gather all adjacent sectors
            const directions = [
                { dr: -1, dc: 0 },  // up
                { dr: 1, dc: 0 },   // down
                { dr: 0, dc: -1 },  // left
                { dr: 0, dc: 1 }    // right
            ];

            for (const hit of weakenedHits) {
                for (const { dr, dc } of directions) {
                    const nr = hit.row + dr, nc = hit.col + dc;
                    if (nr >= 0 && nr <= 9 && nc >= 0 && nc <= 9) {
                        const candidateSector = this.gameInstance.playerGrid.sectors[nr][nc];
                        // Can't select previously targeted sectors or sectors already added to collection
                        if (!candidateSector.state.hasFlag(WarshipsSectorState.miss)
                            && !candidateSector.state.hasFlag(WarshipsSectorState.hit)
                            && !adjacentSectors.some(s => s.row === nr && s.col === nc)
                        ) {
                            const candidateSectorShip = this.gameInstance.playerGrid.ships().find(s => s.id === candidateSector.shipId);
                            if (this.gameInstance.difficulty === WarshipsDifficulty.recruit
                                && candidateSectorShip
                                && candidateSectorShip.health === candidateSectorShip.length
                            ) {
                                // Disallow Recruit from hitting more than one ship at a time
                                continue;
                            }
                            adjacentSectors.push({ row: nr, col: nc });
                        }
                    }
                }
            }
        }

        return adjacentSectors;
    }

    private _filterOutOccupiedSectors(untargetedSectors: WarshipsSector[]): WarshipsSector[] {
        return untargetedSectors.filter(s => !s.state.hasFlag(WarshipsSectorState.ship));
    }

    private _filterOutUnoccupiedSectors(untargetedSectors: WarshipsSector[]): WarshipsSector[] {
        return untargetedSectors.filter(s => s.state.hasFlag(WarshipsSectorState.ship));
    }

    private _canAnyShipFitAt(row: number, col: number): boolean {
        const remainingLengths = this.gameInstance.playerGrid.ships().filter(s => s.health > 0).map(s => s.length);

        for (const length of remainingLengths) {
            // Check horizontal
            let fitsHorizontal = true;
            for (let i = 0; i < length; i++) {
                const c = col - i;
                if (c < 0 || c + length > 10) {
                    continue;
                }
                fitsHorizontal = true;
                for (let j = 0; j < length; j++) {
                    const sector = this.gameInstance.playerGrid.sectors[row][c + j];
                    if (sector.state.hasFlag(WarshipsSectorState.miss) || sector.state.hasFlag(WarshipsSectorState.hit)) {
                        fitsHorizontal = false;
                        break;
                    }
                }
                if (fitsHorizontal) {
                    return true;
                }
            }

            // Check vertical
            let fitsVertical = true;
            for (let i = 0; i < length; i++) {
                const r = row - i;
                if (r < 0 || r + length > 10) {
                    continue;
                }
                fitsVertical = true;
                for (let j = 0; j < length; j++) {
                    const sector = this.gameInstance.playerGrid.sectors[r + j][col];
                    if (sector.state.hasFlag(WarshipsSectorState.miss) || sector.state.hasFlag(WarshipsSectorState.hit)) {
                        fitsVertical = false;
                        break;
                    }
                }
                if (fitsVertical) {
                    return true;
                }
            }
        }

        return false;
    }
}
