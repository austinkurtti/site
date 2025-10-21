export enum WarshipsScreenState {
    menu = 1,
    game = 2
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
