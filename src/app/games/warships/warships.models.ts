export enum WarshipsScreenState {
    menu = 1,
    game = 2
}

export enum WarshipsGameState {
    deploying = 1,
    running = 2,
    paused = 3,
    won = 4,
    lost = 5
}

export enum WarshipsSectorState {
    empty   = 1 << 0,
    ship    = 1 << 1,
    miss    = 1 << 2,
    hit     = 1 << 3
}

export class WarshipsSector {
    public state = WarshipsSectorState.empty;
}

export class WarshipsGrid {
    public sectors: WarshipsSector[][];
}

export class WarshipsGameInstance {
    public playerGrid: WarshipsGrid;
    public computerGrid: WarshipsGrid;
}

export enum WarshipsShipOrientation {
    horizontal = 1,
    vertical = 2
}

export class WarshipsShip {
    public id: string;
    public name: string;
    public orientation = WarshipsShipOrientation.horizontal;
    public length: number;

    constructor(name: string, length: number) {
        this.id = name.replaceAll(' ', '-').toLowerCase();
        this.name = name;
        this.length = length;
    }
}
