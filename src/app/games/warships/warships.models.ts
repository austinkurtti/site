import { signal } from '@angular/core';

export type WarshipsCoord = { row: number, col: number };

export enum WarshipsScreenState {
    menu = 1,
    game = 2
}

export enum WarshipsGameState {
    deploying = 1,
    running = 2,
    paused = 3,
    victory = 4,
    defeat = 5
}

export enum WarshipsSectorState {
    empty       = 1 << 0,
    ship        = 1 << 1,
    placeholder = 1 << 2,
    miss        = 1 << 3,
    hit         = 1 << 4
}

export enum WarshipsTurn {
    player = 1,
    computer = 2
}

export enum WarshipsEventType {
    state = 1,
    miss = 2,
    hit = 3,
    sink = 4
}

export class WarshipsSector {
    public state = WarshipsSectorState.empty;
    public shipId?: string = null;
}

export class WarshipsGrid {
    public sectors: WarshipsSector[][];
    public ships = signal([
        new WarshipsShip('Carrier', 5),
        new WarshipsShip('Cruiser', 4),
        new WarshipsShip('Destroyer', 3),
        new WarshipsShip('Submarine', 3),
        new WarshipsShip('Patrol Ship', 2)
    ]);
}

export class WarshipsGameInstance {
    public gameState = signal(WarshipsGameState.deploying);
    public playerGrid = new WarshipsGrid();
    public computerGrid = new WarshipsGrid();
    public turn = signal<WarshipsTurn>(null);
    public eventLog: WarshipsEvent[] = [];
}

export enum WarshipsShipOrientation {
    horizontal = 1,
    vertical = 2
}

export class WarshipsShip {
    public id: string;
    public name: string;
    public length: number;
    public health: number;
    public orientation = WarshipsShipOrientation.horizontal;
    public deployed = false;
    public anchorSector?: WarshipsCoord = null;

    constructor(name: string, length: number) {
        this.id = name.replaceAll(' ', '-').toLowerCase();
        this.name = name;
        this.length = length;
        this.health = length;
    }
}

export class WarshipsEvent {
    public type: WarshipsEventType;
    public message: string;

    constructor(type: WarshipsEventType, message: string) {
        this.type = type;
        this.message = message;
    }
}
