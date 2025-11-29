import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { WarshipsManager } from '../warships-manager';
import { WarshipsGameState, WarshipsScreenState, WarshipsSectorState, WarshipsShipOrientation } from '../warships.models';

@Component({
    selector: 'ak-warships-end-game-screen',
    styleUrl: './end-game-screen.component.scss',
    templateUrl: './end-game-screen.component.html',
    imports: [
        CommonModule,
        NgOptimizedImage
    ]
})
export class WarshipsEndGameScreenComponent {
    public gameManager = inject(WarshipsManager);

    public String = String;
    public GameState = WarshipsGameState;
    public SectorState = WarshipsSectorState;
    public ShipOrientation = WarshipsShipOrientation;

    private _router = inject(Router);

    public playAgain(): void {
        this.gameManager.gameInstance = null;
        this.gameManager.screen.set(WarshipsScreenState.menu);
    }

    public exit(): void {
        this._router.navigateByUrl('/games');
    }
}
