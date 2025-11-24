import { Injectable, signal } from '@angular/core';
import { WarshipsDifficulty, WarshipsGameInstance, WarshipsScreenState } from './warships.models';

@Injectable()
export class WarshipsManager {
    public readonly localStoragePrefix = 'warships';

    public screen = signal(WarshipsScreenState.menu);

    public gameInstance: WarshipsGameInstance;

    public newGame(difficulty: WarshipsDifficulty): void {
        this.gameInstance = new WarshipsGameInstance();
        this.gameInstance.difficulty = difficulty;
        this.screen.set(WarshipsScreenState.game);
    }
}
