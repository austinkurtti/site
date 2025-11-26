import { Injectable, signal } from '@angular/core';
import { WarshipsCoord, WarshipsDifficulty, WarshipsEventType, WarshipsGameInstance, WarshipsScreenState, WarshipsSector, WarshipsSectorState } from './warships.models';

@Injectable()
export class WarshipsManager {
    public readonly localStoragePrefix = 'warships';

    public screen = signal(WarshipsScreenState.menu);

    public gameInstance: WarshipsGameInstance;

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

    public newGame(difficulty: WarshipsDifficulty): void {
        this.gameInstance = new WarshipsGameInstance();
        this.gameInstance.difficulty = difficulty;
        this.screen.set(WarshipsScreenState.game);
    }

    public computerSelectNextSector(): WarshipsCoord {
        let targetSectorCoords: WarshipsCoord;

        // Find sectors containing weakened ships
        const weakenedHits: WarshipsCoord[] = [];
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

            switch (this.gameInstance.difficulty) {
                case WarshipsDifficulty.easy:
                    // Disallow chained ship hits
                    if (mostRecentEventIsSink) {
                        console.log('chaining disallowed');
                        untargetedSectors = this._filterOccupiedSectors(untargetedSectors);
                    } else if (Math.floor(Math.random() * 2) < 1) {
                        // 50% chance to remove occupied sectors
                        console.log('50% chance succeeded');
                        untargetedSectors = this._filterOccupiedSectors(untargetedSectors);
                    }
                    break;
                case WarshipsDifficulty.medium:
                    // Disallow chained ship hits
                    if (mostRecentEventIsSink) {
                        console.log('chaining disallowed');
                        untargetedSectors = this._filterOccupiedSectors(untargetedSectors);
                    } else if (Math.floor(Math.random() * 5) < 1) {
                        // 20% chance to remove occupied sectors
                        console.log('20% chance succeeded');
                        untargetedSectors = this._filterOccupiedSectors(untargetedSectors);
                    }
                    break;
                case WarshipsDifficulty.hard:
                    // No restrictions or buffs
                    break;
                case WarshipsDifficulty.expert:
                    // TODO - buff with chance to remove some number of farthest sectors from remaining ships
                    break;
            }
            const targetSector = untargetedSectors[Math.floor(Math.random() * untargetedSectors.length)];
            const idPieces = targetSector.id.split('-');
            targetSectorCoords = { row: +idPieces[0], col: +idPieces[1] };
        }

        return targetSectorCoords;
    }

    private _getWeakenedShipAdjacentSectorCoords(weakenedHits: WarshipsCoord[]): WarshipsCoord[] {
        const adjacentSectors: WarshipsCoord[] = [];

        // Disallow Recruit from trying pattern check
        if (weakenedHits.length > 1 && this.gameInstance.difficulty !== WarshipsDifficulty.easy) {
            // Check for a hit pattern that should be continued in the same row or col
            const sorted = [...weakenedHits].sort((a, b) => a.row - b.row || a.col - b.col);
            const sameRow = sorted.every(hit => hit.row === sorted[0].row);
            const sameCol = sorted.every(hit => hit.col === sorted[0].col);

            if (sameRow) {
                const row = sorted[0].row;
                const leftCol = sorted[0].col - 1;
                if (leftCol >= 0) {
                    adjacentSectors.push({ row, col: leftCol });
                }
                const rightCol = sorted[sorted.length - 1].col + 1;
                if (rightCol <= 9) {
                    adjacentSectors.push({ row, col: rightCol });
                }
            } else if (sameCol) {
                const col = sorted[0].col;
                const aboveRow = sorted[0].row - 1;
                if (aboveRow >= 0) {
                    adjacentSectors.push({ row: aboveRow, col });
                }
                const belowRow = sorted[sorted.length - 1].row + 1;
                if (belowRow <= 9) {
                    adjacentSectors.push({ row: belowRow, col });
                }
            }
        } else {
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
                            if (this.gameInstance.difficulty === WarshipsDifficulty.easy
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

    private _filterOccupiedSectors(untargetedSectors: WarshipsSector[]): WarshipsSector[] {
        return untargetedSectors.filter(s => !s.state.hasFlag(WarshipsSectorState.ship));
    }
}
