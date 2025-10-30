import { WarshipsSector, WarshipsSectorState, WarshipsShipOrientation } from './warships.models';

export const tryShipDeploy = (
    row: number,
    col: number,
    length: number,
    orientation: WarshipsShipOrientation,
    sectors: WarshipsSector[][]
): { r: number, c: number }[] => {
    const occupiedSectors: { r: number, c: number }[] = [];
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
        occupiedSectors.push({ r, c });
    }
    return occupiedSectors;
};
