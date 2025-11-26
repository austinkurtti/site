import { WarshipsCoord, WarshipsSector, WarshipsSectorState, WarshipsShipOrientation } from './warships.models';

export const getCoordinates = (row: number, col: number): string => {
    const rows = 'ABCDEFGHIJ';
    return `${rows.charAt(row)}, ${col + 1}`;
}

/**
 * Attempts to place the ship at the given position. If the original position is not valid, it will try to
 * find the closest valid position to snap to instead. The search will occur first within the same row (if
 * horizontal) or col (if vertical), then iteratively to the next closest rows or cols (again depending on
 * orientation).
 * 
 * Based on ship lengths and grid size, a position _should_ be guaranteed. But just in case one is not
 * found, an empty array is returned.
 *
 * @param row Grid row origin
 * @param col Grid col origin
 * @param length Ship length
 * @param orientation Ship orientation (horizontal or vertical)
 * @param sectors Grid sectors to search
 * @returns Array of sectors containing closest valid position
 */
export const tryShipDeploy = (
    row: number,
    col: number,
    length: number,
    orientation: WarshipsShipOrientation,
    sectors: WarshipsSector[][]
): WarshipsCoord[] => {
    const isHorizontal = orientation === WarshipsShipOrientation.horizontal;
    let bestSectors: WarshipsCoord[] = [];

    // First, test the original position
    bestSectors = tryPosition(row, col, length, orientation, sectors);
    if (bestSectors.length > 0) {
        return bestSectors;
    }

    // Search backward in the same row/col
    bestSectors = isHorizontal
        ? searchRow(row, col - 1, length, true, sectors)
        : searchCol(row - 1, col, length, true, sectors);
    if (bestSectors.length > 0) {
        return bestSectors;
    }

    // Search forward in the same row/col
    bestSectors = isHorizontal
        ? searchRow(row, col + 1, length, false, sectors)
        : searchCol(row + 1, col, length, false, sectors);
    if (bestSectors.length > 0) {
        return bestSectors;
    }

    // Cycle between searching next whole row/col backwards and forwards
    let nextUnitBack = (isHorizontal ? row : col) - 1;
    let nextUnitForward = (isHorizontal ? row : col) + 1;
    while (nextUnitBack >= 0 || nextUnitForward <= 9) {
        // Search backward and forward within next row/col backwards, adjacent to original position
        if (nextUnitBack >= 0) {
            bestSectors = isHorizontal
                ? searchRow(nextUnitBack, col, length, true, sectors)
                : searchCol(row, nextUnitBack, length, true, sectors);
            if (bestSectors.length > 0) {
                break;
            }

            bestSectors = isHorizontal
                ? searchRow(nextUnitBack, col + 1, length, false, sectors)
                : searchCol(row + 1, nextUnitBack, length, false, sectors);
            if (bestSectors.length > 0) {
                break;
            }
        }

        // Search backward and forward within next row/col forwards, adjacent to original position
        if (nextUnitForward <= 9) {
            bestSectors = isHorizontal
                ? searchRow(nextUnitForward, col, length, true, sectors)
                : searchCol(row, nextUnitForward, length, true, sectors);
            if (bestSectors.length > 0) {
                break;
            }

            bestSectors = isHorizontal
                ? searchRow(nextUnitForward, col + 1, length, false, sectors)
                : searchCol(row + 1, nextUnitForward, length, false, sectors);
            if (bestSectors.length > 0) {
                break;
            }
        }

        nextUnitBack--;
        nextUnitForward++;
    }
    return bestSectors;
};

/**
 * Determines if ship placement is valid for a single location.
 *
 * @param row Anchor row position
 * @param col Anchor col position
 * @param length Ship length
 * @param orientation Ship orientation (horizontal or vertical)
 * @param sectors Grid sectors to search
 * @returns If placement is valid, an array containing the valid sectors. If placement is invalid, an empty array.
 */
const tryPosition = (
    row: number,
    col: number,
    length: number,
    orientation: WarshipsShipOrientation,
    sectors: WarshipsSector[][]
): WarshipsCoord[] => {
    let candidates: WarshipsCoord[] = [];
    for (let i = 0; i < length; i++) {
        let r = row, c = col;
        if (orientation === WarshipsShipOrientation.horizontal) {
            c += i;
        } else {
            r += i;
        }

        if (r > 9 || c > 9 || sectors[r][c].state.hasFlag(WarshipsSectorState.ship)) {
            candidates = [];
            break;
        }
        candidates.push({ row: r, col: c });
    }
    return candidates;
}

/**
 * Iteratively calls tryPosition for all columns in a row in the given direction. Assumes the ship is horizontal.
 *
 * @param row Row to iterate within
 * @param startCol Column to start at
 * @param length Ship length
 * @param backward True to search backward, false to search forward
 * @param sectors Grid sectors to search
 * @returns If a valid position is found, an array containing the valid sectors. If placement is invalid, an empty array.
 */
const searchRow = (row: number, startCol: number, length: number, backward: boolean, sectors: WarshipsSector[][]): WarshipsCoord[] => {
    let candidates: WarshipsCoord[] = [];
    while (startCol >= 0 && startCol <= 9) {
        candidates = tryPosition(row, startCol, length, WarshipsShipOrientation.horizontal, sectors);
        if (candidates.length > 0) {
            break;
        }
        startCol = backward ? startCol - 1 : startCol + 1;
    }
    return candidates;
}

/**
 * Iteratively calls tryPosition for all rows in a column in the given direction. Assumes the ship is vertical.
 *
 * @param startRow Row to start at
 * @param col Column to iterate within
 * @param length Ship length
 * @param backward True to search backward, false to search forward
 * @param sectors Grid sectors to search
 * @returns If a valid position is found, an array containing the valid sectors. If placement is invalid, an empty array.
 */
const searchCol = (startRow: number, col: number, length: number, backward: boolean, sectors: WarshipsSector[][]): WarshipsCoord[] => {
    let candidates: WarshipsCoord[] = [];
    while (startRow >= 0 && startRow <= 9) {
        candidates = tryPosition(startRow, col, length, WarshipsShipOrientation.vertical, sectors);
        if (candidates.length > 0) {
            break;
        }
        startRow = backward ? startRow - 1 : startRow + 1;
    }
    return candidates;
}
