import { WarshipsCoord, WarshipsSector, WarshipsSectorState, WarshipsShipOrientation } from './warships.models';

export const getCoordinates = (row: number, col: number): string => {
    const rows = 'ABCDEFGHIJ';
    return `${rows.charAt(row)}, ${col + 1}`;
}

/**
 * Attempts to place the ship at the given position. If the original position is not valid, it will try to
 * find the closest valid position to snap to instead, first using a backward (toward the grid origin) search
 * since the mouse position technically represents the left/top of the ship. If no position is found backward
 * it will search forward.
 * @param row Grid row origin
 * @param col Grid col origin
 * @param length Ship length
 * @param orientation Ship orientation (horizontal or vertical)
 * @param sectors Grid sectors to search
 * @returns Array of sectors containing closest valid position. If none is found, the array will be empty.
 */
export const tryShipDeploy = (
    row: number,
    col: number,
    length: number,
    orientation: WarshipsShipOrientation,
    sectors: WarshipsSector[][]
): WarshipsCoord[] => {
    let bestSectors: WarshipsCoord[] = [];
    if (orientation === WarshipsShipOrientation.horizontal) {
        const horizontalSearch = (startCol: number): WarshipsCoord[] => {
            let candidates: WarshipsCoord[] = [];
            for (let i = 0; i < length; i++) {
                const r = row, c = startCol + i;
                if (c > 9 || sectors[r][c].state.hasFlag(WarshipsSectorState.ship)) {
                    candidates = [];
                    break;
                }
                candidates.push({ row: r, col: c });
            }
            return candidates;
        };

        // Backward search
        for (let startCol = Math.min(col, 10 - length); startCol >= 0; startCol--) {
            const candidates = horizontalSearch(startCol);
            if (candidates.length > 0) {
                bestSectors = candidates;
                break;
            }
        }
        // Forward search if not found
        if (bestSectors.length === 0) {
            for (let startCol = Math.min(col + 1, 10 - length); startCol <= 10 - length; startCol++) {
                const candidates = horizontalSearch(startCol);
                if (candidates.length > 0) {
                    bestSectors = candidates;
                    break;
                }
            }
        }
    } else {
        const verticalSearch = (startRow: number): WarshipsCoord[] => {
            let candidates: WarshipsCoord[] = [];
            for (let i = 0; i < length; i++) {
                const r = startRow + i, c = col;
                if (r > 9 || sectors[r][c].state.hasFlag(WarshipsSectorState.ship)) {
                    candidates = [];
                    break;
                }
                candidates.push({ row: r, col: c });
            }
            return candidates;
        };

        // Backward search
        for (let startRow = Math.min(row, 10 - length); startRow >= 0; startRow--) {
            const candidates = verticalSearch(startRow) ;
            if (candidates.length > 0) {
                bestSectors = candidates;
                break;
            }
        }
        // Forward search if not found
        if (bestSectors.length === 0) {
            for (let startRow = Math.min(row + 1, 10 - length); startRow <= 10 - length; startRow++) {
                const candidates = verticalSearch(startRow);
                if (candidates.length > 0) {
                    bestSectors = candidates;
                    break;
                }
            }
        }
    }
    return bestSectors;
};
