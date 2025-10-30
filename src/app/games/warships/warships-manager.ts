import { Injectable, signal } from '@angular/core';
import { WarshipsGameInstance, WarshipsScreenState } from './warships.models';

@Injectable()
export class WarshipsManager {
    public readonly localStoragePrefix = 'warships';

    public screen = signal(WarshipsScreenState.menu);

    public gameInstance: WarshipsGameInstance;

    public newGame(): void {
        this.gameInstance = new WarshipsGameInstance();
        this.screen.set(WarshipsScreenState.game);
    }
}
