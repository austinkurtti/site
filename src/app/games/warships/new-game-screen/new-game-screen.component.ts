import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccordionContentDirective } from "@directives/accordion/accordion-content.directive";
import { AccordionGroupDirective } from "@directives/accordion/accordion-group.directive";
import { AccordionHeaderDirective } from "@directives/accordion/accordion-header.directive";
import { timer } from 'rxjs';
import { take } from 'rxjs/operators';
import { WarshipsImagePreloadService } from '../warships-image-preload.service';
import { WarshipsManager } from '../warships-manager';
import { WarshipsDifficulty, WarshipsScreenState } from '../warships.models';

@Component({
    selector: 'ak-warships-new-game-screen',
    styleUrl: './new-game-screen.component.scss',
    templateUrl: './new-game-screen.component.html',
    imports: [
        AccordionContentDirective,
        AccordionGroupDirective,
        AccordionHeaderDirective,
        CommonModule,
        FormsModule
    ]
})
export class WarshipsNewGameScreen {
    public gameManager = inject(WarshipsManager);

    public difficulty = signal(WarshipsDifficulty.recruit);
    public preloading = signal(false);
    public preloadTotal = signal(0);
    public preloadProgress = signal(0);

    public Difficulty = WarshipsDifficulty;
    public ScreenState = WarshipsScreenState;

    private _imgPreloadService = inject(WarshipsImagePreloadService);

    public start(): void {
        const goToGameScreen = () => {
            this.gameManager.newGame(this.difficulty());
        }

        this.preloading.set(true);
        const promises = this._imgPreloadService.preloadImages([
            // Side-profile images
            'carrier.png', 'cruiser.png', 'destroyer.png', 'submarine.png', 'patrol-ship.png',
            // Top-down images
            'carrier-top-down.png', 'cruiser-top-down.png', 'destroyer-top-down.png', 'submarine-top-down.png', 'patrol-ship-top-down.png',
            // Top-down-vertical images
            'carrier-top-down-vertical.png', 'cruiser-top-down-vertical.png', 'destroyer-top-down-vertical.png', 'submarine-top-down-vertical.png', 'patrol-ship-top-down-vertical.png'
        ]);

        let loaded = 0;
        const total = promises.length;
        this.preloadTotal.set(total);

        if (total === 0) {
            this.preloading.set(false);
            goToGameScreen();
            return;
        }

        promises.forEach(p => {
            p.then(() => {
                loaded++;
                this.preloadProgress.set((loaded / total) * 100);
                if (loaded === total) {
                    // Delay going to game screen so player can see loading finished successfully
                    timer(500).pipe(take(1)).subscribe(() => {
                        goToGameScreen();
                    });
                }
            });
        });
    }
}
