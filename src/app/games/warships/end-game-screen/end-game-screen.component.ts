import { CommonModule, NgOptimizedImage } from '@angular/common';
import { AfterViewInit, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { EffectsService } from '@services/effects.service';
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
export class WarshipsEndGameScreenComponent implements AfterViewInit {
    public gameManager = inject(WarshipsManager);

    public String = String;
    public GameState = WarshipsGameState;
    public SectorState = WarshipsSectorState;
    public ShipOrientation = WarshipsShipOrientation;

    private _effectsService = inject(EffectsService);
    private _router = inject(Router);

    public ngAfterViewInit(): void {
        const textEl = document.querySelector('h1 span');
        this._effectsService.typeText(textEl as HTMLElement).finally(() => {
            if (this.gameManager.gameInstance.gameState() === WarshipsGameState.victory) {
                this._effectsService.fireworks();
            }
        });
    }

    public playAgain(): void {
        this.gameManager.gameInstance = null;
        this.gameManager.screen.set(WarshipsScreenState.menu);
    }

    public exit(): void {
        this._router.navigateByUrl('/games');
    }
}
