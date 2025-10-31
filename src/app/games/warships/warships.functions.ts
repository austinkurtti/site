import { WarshipsCoord, WarshipsSector, WarshipsSectorState, WarshipsShipOrientation } from './warships.models';

export const getCoordinates = (row: number, col: number): string => {
    const rows = 'ABCDEFGHIJ';
    return `${rows.charAt(row)}, ${col + 1}`;
}

export const tryShipDeploy = (
    row: number,
    col: number,
    length: number,
    orientation: WarshipsShipOrientation,
    sectors: WarshipsSector[][]
): WarshipsCoord[] => {
    const occupiedSectors: WarshipsCoord[] = [];
    for (let i = 0; i < length; i++) {
        let r = row, c = col;
        if (orientation === WarshipsShipOrientation.horizontal) {
            c += i;
        } else {
            r += i;
        }

        if (r > 9 || c > 9 || sectors[r][c].state.hasFlag(WarshipsSectorState.ship)) {
            // Deployment not allowed - out of bounds or overlaps another deployed ship
            return [];
        }
        occupiedSectors.push({ row: r, col: c });
    }
    return occupiedSectors;
};
